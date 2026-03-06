package com.demeter.backend.ai.dto.Recommendation;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationRequest {

    @JsonProperty("user_id")
    private Integer userId;

    @JsonProperty("purchase_history")
    private List<PurchaseHistoryItem> purchaseHistory;

    @JsonProperty("current_time")
    private LocalDateTime currentTime;

    @JsonProperty("dietary_preferences")
    private List<String> dietaryPreferences;

    @JsonProperty("cafeteria_id")
    private Integer cafeteriaId;

    @Builder.Default
    private String context = "homepage";

    @Builder.Default
    private Integer limit = 3;

    // Inner class for Purchase History to keep it in one file
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PurchaseHistoryItem {
        @JsonProperty("item_id")
        private Integer itemId;

        @JsonProperty("item_name")
        private String itemName;

        @JsonProperty("category_id")
        private Integer categoryId;

        @JsonProperty("purchase_count")
        private Integer purchaseCount;

        @JsonProperty("last_purchased")
        private LocalDateTime lastPurchased;

        @JsonProperty("total_spent")
        private Double totalSpent;
    }
}