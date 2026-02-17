package com.demeter.backend.promotions.service;

import com.demeter.backend.promotions.dto.DiscountCalculationResponse;
import org.springframework.stereotype.Service;

@Service
public class PromotionEngineService {
    private final PromoCodeService promoCodeService;
    private final DiscountRuleService discountRuleService;

    public PromotionEngineService(PromoCodeService promoCodeService, 
                                  PromotionService promotionService,
                                  DiscountRuleService discountRuleService) {
        this.promoCodeService = promoCodeService;
        this.discountRuleService = discountRuleService;
    }

    /**
     * Calculate discount for an order based on promo code
     */
    public DiscountCalculationResponse calculateDiscountWithPromoCode(String promoCode, 
                                                                       Double orderAmount) {
        DiscountCalculationResponse response = new DiscountCalculationResponse();
        response.setOriginalAmount(orderAmount);

        if (promoCode == null || promoCode.isEmpty()) {
            response.setDiscountAmount(0.0);
            response.setFinalAmount(orderAmount);
            return response;
        }

        Double discountAmount = promoCodeService.applyPromoCode(promoCode, orderAmount);
        
        response.setAppliedPromoCode(promoCode);
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(orderAmount - discountAmount);
        
        if (discountAmount > 0) {
            response.setDiscountDescription("Promo code applied successfully");
        } else {
            response.setDiscountDescription("Invalid or expired promo code");
        }

        return response;
    }

    /**
     * Calculate discount for an order based on discount rules
     */
    public DiscountCalculationResponse calculateDiscountWithRules(Double orderAmount, 
                                                                  Integer itemCount, 
                                                                  String userRole) {
        DiscountCalculationResponse response = new DiscountCalculationResponse();
        response.setOriginalAmount(orderAmount);

        Double discountAmount = discountRuleService.calculateTotalDiscount(orderAmount, itemCount, userRole);
        
        response.setDiscountAmount(discountAmount);
        response.setFinalAmount(orderAmount - discountAmount);
        
        if (discountAmount > 0) {
            response.setDiscountDescription("Discount rules applied successfully");
        } else {
            response.setDiscountDescription("No applicable discount rules found");
        }

        return response;
    }

    /**
     * Calculate discount considering both promo code and rules
     */
    public DiscountCalculationResponse calculateBestDiscount(String promoCode, 
                                                             Double orderAmount, 
                                                             Integer itemCount, 
                                                             String userRole) {
        DiscountCalculationResponse promoResponse = calculateDiscountWithPromoCode(promoCode, orderAmount);
        DiscountCalculationResponse ruleResponse = calculateDiscountWithRules(orderAmount, itemCount, userRole);

        // Apply the better discount
        DiscountCalculationResponse bestResponse = new DiscountCalculationResponse();
        bestResponse.setOriginalAmount(orderAmount);

        if (promoResponse.getDiscountAmount() >= ruleResponse.getDiscountAmount()) {
            bestResponse.setDiscountAmount(promoResponse.getDiscountAmount());
            bestResponse.setAppliedPromoCode(promoCode);
            bestResponse.setDiscountDescription("Promo code applied");
        } else {
            bestResponse.setDiscountAmount(ruleResponse.getDiscountAmount());
            bestResponse.setDiscountDescription("Rule-based discount applied");
        }

        bestResponse.setFinalAmount(orderAmount - bestResponse.getDiscountAmount());
        return bestResponse;
    }
}
