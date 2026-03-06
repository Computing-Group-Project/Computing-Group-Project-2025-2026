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
public class RecommendationResponse {

    @JsonProperty("user_id")
    private Integer userId;

    private List<RecommendationItem> recommendations;

    @JsonProperty("generated_at")
    private LocalDateTime generatedAt;

    @JsonProperty("model_version")
    private String modelVersion;
}