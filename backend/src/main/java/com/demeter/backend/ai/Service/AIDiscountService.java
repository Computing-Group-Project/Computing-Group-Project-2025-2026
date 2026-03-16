package com.demeter.backend.ai.service;

import com.demeter.backend.ai.client.AIServiceClient;
import com.demeter.backend.ai.dto.Discount.DiscountGenerationRequest;
import com.demeter.backend.ai.dto.Discount.DiscountGenerationResponse;
import com.demeter.backend.ai.dto.Discount.DiscountSuggestion;
import com.demeter.backend.menu.model.Menu;
import com.demeter.backend.menu.repo.MenuRepository;
import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.model.OrderItem;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.promotions.model.Discount;
import com.demeter.backend.promotions.repo.DiscountRepository;
import com.demeter.backend.promotions.service.DiscountService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIDiscountService {

    private final AIServiceClient aiServiceClient;
    private final DiscountService discountService;
    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;
    private final DiscountRepository discountRepository;
    private final ObjectMapper objectMapper;

    public AIDiscountService(AIServiceClient aiServiceClient,
                             DiscountService discountService,
                             OrderRepository orderRepository,
                             MenuRepository menuRepository,
                             DiscountRepository discountRepository,
                             ObjectMapper objectMapper) {
        this.aiServiceClient = aiServiceClient;
        this.discountService = discountService;
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
        this.discountRepository = discountRepository;
        this.objectMapper = objectMapper;
    }

    public List<Discount> generateDiscountsForCafeteria(Integer cafeteriaId) {
        log.info("Generating AI discounts for cafeteria {}", cafeteriaId);

        // Fetch orders and menu items for the cafeteria
        List<Order> orders = orderRepository.findByCafeteriaId(Long.valueOf(cafeteriaId));
        List<Menu> menuItems = menuRepository.findByCafeteriaId(Long.valueOf(cafeteriaId));

        // Aggregate sales data from orders grouped by menu item
        Map<Long, SalesAggregate> salesAggregates = new HashMap<>();
        for (Order order : orders) {
            if (order.getItems() == null) continue;
            for (OrderItem item : order.getItems()) {
                salesAggregates.computeIfAbsent(item.getMenuItemId(), k -> new SalesAggregate())
                        .addSale(item.getQuantity(), item.getSubtotal() != null ? item.getSubtotal().doubleValue() : 0.0);
            }
        }

        // Build SalesDataItem list
        List<DiscountGenerationRequest.SalesDataItem> salesDataItems = new ArrayList<>();
        for (Menu menu : menuItems) {
            SalesAggregate agg = salesAggregates.getOrDefault(menu.getMenuId(), new SalesAggregate());
            salesDataItems.add(DiscountGenerationRequest.SalesDataItem.builder()
                    .itemId(menu.getMenuId().intValue())
                    .itemName(menu.getName())
                    .categoryId(menu.getCategory() != null ? menu.getCategory().getCategoryId().intValue() : null)
                    .basePrice(menu.getBasePrice() != null ? menu.getBasePrice().doubleValue() : null)
                    .totalSales(agg.totalQuantity)
                    .revenue(agg.totalRevenue)
                    .last30DaysSales(agg.totalQuantity) // simplified: using total as approximation
                    .averageRating(null)
                    .build());
        }

        // Get current active discount IDs
        List<Integer> currentDiscountIds = discountRepository
                .findByCafeteriaIdAndIsActive(cafeteriaId, true)
                .stream()
                .map(Discount::getDiscountId)
                .collect(Collectors.toList());

        // Build request and call AI service
        DiscountGenerationRequest request = DiscountGenerationRequest.builder()
                .cafeteriaId(cafeteriaId)
                .salesData(salesDataItems)
                .currentDiscounts(currentDiscountIds)
                .build();

        DiscountGenerationResponse response = aiServiceClient.generateDiscounts(request);

        // Convert suggestions to Discount entities and save
        List<Discount> createdDiscounts = new ArrayList<>();
        if (response != null && response.getSuggestions() != null) {
            for (DiscountSuggestion suggestion : response.getSuggestions()) {
                Discount discount = new Discount();
                discount.setCafeteriaId(cafeteriaId);
                discount.setDiscountType(suggestion.getDiscountType().name());
                discount.setDiscountValue(BigDecimal.valueOf(suggestion.getDiscountValue()));
                discount.setApplicableItems(toJsonString(suggestion.getApplicableItems()));
                discount.setRequirements(toJsonString(suggestion.getRequirements()));
                discount.setAiGenerated(true);
                discount.setIsActive(false);
                discount.setStartDate(LocalDate.now());
                discount.setEndDate(LocalDate.now().plusDays(7));

                Discount saved = discountService.createDiscount(discount);
                createdDiscounts.add(saved);
                log.info("Created AI discount suggestion {} for cafeteria {}", saved.getDiscountId(), cafeteriaId);
            }
        }

        log.info("Generated {} AI discount suggestions for cafeteria {}", createdDiscounts.size(), cafeteriaId);
        return createdDiscounts;
    }

    private String toJsonString(Object obj) {
        if (obj == null) return null;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            log.warn("Failed to serialize object to JSON, using toString()", e);
            return String.valueOf(obj);
        }
    }

    /**
     * Helper class to aggregate sales data per menu item.
     */
    private static class SalesAggregate {
        int totalQuantity = 0;
        double totalRevenue = 0.0;

        void addSale(int quantity, double revenue) {
            this.totalQuantity += quantity;
            this.totalRevenue += revenue;
        }
    }
}
