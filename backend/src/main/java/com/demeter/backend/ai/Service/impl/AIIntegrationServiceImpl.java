package com.demeter.backend.ai.Service.impl;

import com.demeter.backend.ai.Service.AIIntegrationService;
import com.demeter.backend.ai.client.AIServiceClient;
import com.demeter.backend.ai.config.AIServiceConfig;
import com.demeter.backend.ai.dto.Recommendation.RecommendationItem;
import com.demeter.backend.ai.dto.Recommendation.RecommendationRequest;
import com.demeter.backend.ai.dto.Recommendation.RecommendationResponse;
import com.demeter.backend.ai.enums.RecommendationType;
import com.demeter.backend.ai.exception.AIServiceException;
import com.demeter.backend.menu.model.Menu;
import com.demeter.backend.menu.repo.MenuRepository;
import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.model.OrderItem;
import com.demeter.backend.orders.repo.OrderRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AIIntegrationServiceImpl implements AIIntegrationService {

    private final AIServiceClient aiServiceClient;
    private final OrderRepository orderRepository;
    private final MenuRepository menuRepository;
    private final AIServiceConfig config;

    public AIIntegrationServiceImpl(AIServiceClient aiServiceClient,
                                    OrderRepository orderRepository,
                                    MenuRepository menuRepository,
                                    AIServiceConfig config) {
        this.aiServiceClient = aiServiceClient;
        this.orderRepository = orderRepository;
        this.menuRepository = menuRepository;
        this.config = config;
    }

    @Override
    public RecommendationResponse getRecommendations(RecommendationRequest request) {
        List<RecommendationRequest.PurchaseHistoryItem> purchaseHistory =
                buildPurchaseHistory(request.getUserId().longValue());
        request.setPurchaseHistory(purchaseHistory);

        if (request.getCurrentTime() == null) {
            request.setCurrentTime(LocalDateTime.now());
        }

        log.info("Requesting recommendations for user {} at cafeteria {}",
                request.getUserId(), request.getCafeteriaId());

        return aiServiceClient.getRecommendations(request);
    }

    @Override
    public RecommendationResponse getRecommendationsWithFallback(
            RecommendationRequest request,
            List<Integer> fallbackItemIds) {

        if (!config.isEnableFallback()) {
            return getRecommendations(request);
        }

        try {
            return getRecommendations(request);
        } catch (AIServiceException e) {
            log.warn("AI service unavailable, returning fallback recommendations: {}", e.getMessage());
            return buildFallbackResponse(request.getUserId(), request.getCafeteriaId(), request.getLimit());
        }
    }

    @Override
    public boolean isAIServiceAvailable() {
        try {
            RecommendationRequest healthCheck = RecommendationRequest.builder()
                    .userId(0)
                    .cafeteriaId(1)
                    .limit(1)
                    .currentTime(LocalDateTime.now())
                    .purchaseHistory(Collections.emptyList())
                    .build();
            aiServiceClient.getRecommendations(healthCheck);
            return true;
        } catch (Exception e) {
            log.warn("AI service health check failed: {}", e.getMessage());
            return false;
        }
    }

    private List<RecommendationRequest.PurchaseHistoryItem> buildPurchaseHistory(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);

        if (orders == null || orders.isEmpty()) {
            return Collections.emptyList();
        }

        Map<Long, List<OrderItem>> itemGroups = new HashMap<>();
        for (Order order : orders) {
            if (order.getItems() != null) {
                for (OrderItem item : order.getItems()) {
                    itemGroups.computeIfAbsent(item.getMenuItemId(), k -> new ArrayList<>()).add(item);
                }
            }
        }

        return itemGroups.entrySet().stream()
                .map(entry -> {
                    Long menuItemId = entry.getKey();
                    List<OrderItem> items = entry.getValue();

                    int purchaseCount = items.stream().mapToInt(OrderItem::getQuantity).sum();
                    double totalSpent = items.stream()
                            .mapToDouble(oi -> oi.getSubtotal() != null ? oi.getSubtotal().doubleValue() : 0.0)
                            .sum();

                    // Find menu item name and category
                    String itemName = "";
                    Integer categoryId = null;
                    Optional<Menu> menuOpt = menuRepository.findById(menuItemId);
                    if (menuOpt.isPresent()) {
                        Menu menu = menuOpt.get();
                        itemName = menu.getName();
                        if (menu.getCategory() != null) {
                            categoryId = menu.getCategory().getCategoryId() != null
                                    ? menu.getCategory().getCategoryId().intValue() : null;
                        }
                    }

                    return RecommendationRequest.PurchaseHistoryItem.builder()
                            .itemId(menuItemId.intValue())
                            .itemName(itemName)
                            .categoryId(categoryId)
                            .purchaseCount(purchaseCount)
                            .totalSpent(totalSpent)
                            .lastPurchased(LocalDateTime.now())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private RecommendationResponse buildFallbackResponse(Integer userId, Integer cafeteriaId, Integer limit) {
        int resultLimit = (limit != null && limit > 0) ? limit : 3;

        List<Menu> availableItems;
        if (cafeteriaId != null) {
            availableItems = menuRepository.findByCafeteriaId(cafeteriaId.longValue());
        } else {
            availableItems = menuRepository.findAll();
        }

        List<RecommendationItem> fallbackItems = availableItems.stream()
                .filter(Menu::isAvailable)
                .limit(resultLimit)
                .map(menu -> RecommendationItem.builder()
                        .itemId(menu.getMenuId().intValue())
                        .recommendationType(RecommendationType.POPULAR)
                        .confidenceScore(0.5)
                        .reason("Popular item at this cafeteria")
                        .contextData(Map.of("fallback", true, "item_name", menu.getName()))
                        .build())
                .collect(Collectors.toList());

        return RecommendationResponse.builder()
                .userId(userId)
                .recommendations(fallbackItems)
                .generatedAt(LocalDateTime.now())
                .modelVersion("fallback-v1")
                .build();
    }
}
