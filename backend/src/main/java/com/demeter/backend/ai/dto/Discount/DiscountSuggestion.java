package com.demeter.backend.ai.dto.Discount;

import com.demeter.backend.shared.enums.DiscountType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountSuggestion {

    @JsonProperty("discount_type")
    private DiscountType discountType;

    @JsonProperty("discount_value")
    private Double discountValue;

    @JsonProperty("applicable_items")
    private List<Integer> applicableItems;

    private Map<String, Object> requirements;

    @JsonProperty("expected_impact")
    private Map<String, Double> expectedImpact;

    private String reasoning;
}