package com.demeter.backend.ai.dto.Review;

import com.demeter.backend.ai.enums.SentimentType;
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
public class ReviewAnalysisResponse {

    @JsonProperty("review_id")
    private Integer reviewId;

    @JsonProperty("sentiment_score")
    private Double sentimentScore;

    @JsonProperty("sentiment_type")
    private SentimentType sentimentType;

    private List<String> keywords;

    @JsonProperty("is_approved")
    private boolean isApproved;

    private Double confidence;

    @JsonProperty("analysis_notes")
    private String analysisNotes;
}