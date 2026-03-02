package com.demeter.backend.ai.dto.Discount;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountGenerationRequest {

    @JsonProperty("cafeteria_id")
    private Integer cafeteriaId;

    @JsonProperty("sales_data")
    private List<SalesDataItem> salesData;

    @JsonProperty("current_discounts")
    private List<Integer> currentDiscounts;

    @Builder.Default
    @JsonProperty("target_profit_margin")
    private Double targetProfitMargin = 0.3;

    @Builder.Default
    @JsonProperty("max_discount_percentage")
    private Double maxDiscountPercentage = 30.0;

    // Inner class for Sales Data to keep it in one file
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SalesDataItem {
        @JsonProperty("item_id")
        private Integer itemId;

        @JsonProperty("item_name")
        private String itemName;

        @JsonProperty("category_id")
        private Integer categoryId;

        @JsonProperty("base_price")
        private Double basePrice;

        @JsonProperty("total_sales")
        private Integer totalSales;

        private Double revenue;

        @JsonProperty("last_30_days_sales")
        private Integer last30DaysSales;

        @JsonProperty("average_rating")
        private Double averageRating;
    }
}