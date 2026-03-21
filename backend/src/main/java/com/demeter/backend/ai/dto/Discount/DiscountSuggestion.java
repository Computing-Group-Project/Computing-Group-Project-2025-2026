package com.demeter.backend.ai.dto.Discount;

import com.demeter.backend.shared.enums.DiscountType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountSuggestion {

    @JsonProperty("discount_type")
    private DiscountType discountType;

    @JsonProperty("target_item_id")
    private Integer targetItemId;

    @JsonProperty("associated_item_id")
    private Integer associatedItemId;

    @JsonProperty("suggested_value")
    private Double suggestedValue;

    private String reason;
}
