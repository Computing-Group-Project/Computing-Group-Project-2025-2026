package com.demeter.backend.ai.dto.Discount;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountGenerationResponse {

    @JsonProperty("cafeteria_id")
    private Integer cafeteriaId;

    private List<DiscountSuggestion> suggestions;

    @JsonProperty("generated_at")
    private LocalDateTime generatedAt;

    @JsonProperty("analysis_summary")
    private Map<String, Object> analysisSummary;
}