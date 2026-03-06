package com.demeter.backend.ai.dto.Recommendation;

import com.demeter.backend.ai.enums.RecommendationType;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationItem {

    @JsonProperty("item_id")
    private Integer itemId;

    @JsonProperty("recommendation_type")
    private RecommendationType recommendationType;

    @JsonProperty("confidence_score")
    private Double confidenceScore;

    private String reason;

    @JsonProperty("context_data")
    private Map<String, Object> contextData;
}