package com.demeter.backend.promotions.controller;

import com.demeter.backend.promotions.dto.DiscountCalculationResponse;
import com.demeter.backend.promotions.service.PromotionEngineService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/promotions/engine")
public class PromotionEngineController {
    private final PromotionEngineService promotionEngineService;

    public PromotionEngineController(PromotionEngineService promotionEngineService) {
        this.promotionEngineService = promotionEngineService;
    }

    /**
     * Calculate discount using promo code
     */
    @PostMapping("/calculate-with-promo")
    public ResponseEntity<DiscountCalculationResponse> calculateWithPromoCode(
            @RequestParam(required = false) String promoCode,
            @RequestParam Double orderAmount) {
        DiscountCalculationResponse response = promotionEngineService
                .calculateDiscountWithPromoCode(promoCode, orderAmount);
        return ResponseEntity.ok(response);
    }

    /**
     * Calculate discount using rules
     */
    @PostMapping("/calculate-with-rules")
    public ResponseEntity<DiscountCalculationResponse> calculateWithRules(
            @RequestParam Double orderAmount,
            @RequestParam Integer itemCount,
            @RequestParam(required = false) String userRole) {
        DiscountCalculationResponse response = promotionEngineService
                .calculateDiscountWithRules(orderAmount, itemCount, userRole);
        return ResponseEntity.ok(response);
    }

    /**
     * Calculate best available discount
     */
    @PostMapping("/calculate-best")
    public ResponseEntity<DiscountCalculationResponse> calculateBestDiscount(
            @RequestParam(required = false) String promoCode,
            @RequestParam Double orderAmount,
            @RequestParam Integer itemCount,
            @RequestParam(required = false) String userRole) {
        DiscountCalculationResponse response = promotionEngineService
                .calculateBestDiscount(promoCode, orderAmount, itemCount, userRole);
        return ResponseEntity.ok(response);
    }
}
