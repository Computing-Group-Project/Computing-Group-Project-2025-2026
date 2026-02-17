package com.demeter.backend.promotions.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCalculationResponse {
    private Double originalAmount;
    private Double discountAmount;
    private Double finalAmount;
    private String appliedPromoCode;
    private String discountDescription;
}
