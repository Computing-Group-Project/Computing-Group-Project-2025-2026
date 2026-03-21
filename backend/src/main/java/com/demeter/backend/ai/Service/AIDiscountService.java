package com.demeter.backend.ai.service;

import com.demeter.backend.ai.client.AIServiceClient;
import com.demeter.backend.ai.dto.Discount.DiscountGenerationRequest;
import com.demeter.backend.ai.dto.Discount.DiscountGenerationResponse;
import com.demeter.backend.ai.dto.Discount.DiscountSuggestion;
import com.demeter.backend.promotions.model.Discount;
import com.demeter.backend.promotions.service.DiscountService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
public class AIDiscountService {

    private final AIServiceClient aiServiceClient;
    private final DiscountService discountService;
    private final ObjectMapper objectMapper;

    public AIDiscountService(AIServiceClient aiServiceClient,
                             DiscountService discountService,
                             ObjectMapper objectMapper) {
        this.aiServiceClient = aiServiceClient;
        this.discountService = discountService;
        this.objectMapper = objectMapper;
    }

    public List<Discount> generateDiscountsForCafeteria(Integer cafeteriaId) {
        log.info("Generating AI discounts for cafeteria {}", cafeteriaId);

        // Build request — AI service uses its own rule files for sales analysis
        DiscountGenerationRequest request = DiscountGenerationRequest.builder()
                .cafeteriaId(cafeteriaId)
                .build();

        DiscountGenerationResponse response = aiServiceClient.generateDiscounts(request);

        // Convert suggestions to Discount entities and save
        List<Discount> createdDiscounts = new ArrayList<>();
        if (response != null && response.getSuggestions() != null) {
            for (DiscountSuggestion suggestion : response.getSuggestions()) {
                // Build applicable items list from target + associated item IDs
                List<Integer> applicableItems = new ArrayList<>();
                if (suggestion.getTargetItemId() != null) applicableItems.add(suggestion.getTargetItemId());
                if (suggestion.getAssociatedItemId() != null) applicableItems.add(suggestion.getAssociatedItemId());

                Discount discount = new Discount();
                discount.setCafeteriaId(cafeteriaId);
                discount.setDiscountType(suggestion.getDiscountType().name());
                discount.setDiscountValue(BigDecimal.valueOf(suggestion.getSuggestedValue()));
                discount.setApplicableItems(toJsonString(applicableItems));
                discount.setRequirements(toJsonString(Map.of("reason", suggestion.getReason() != null ? suggestion.getReason() : "")));
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
}
