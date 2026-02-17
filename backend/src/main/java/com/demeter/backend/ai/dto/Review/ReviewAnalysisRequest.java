package com.demeter.ai.dto.Review;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewAnalysisRequest {

    @JsonProperty("review_id")
    private Integer reviewId;

    @JsonProperty("review_text")
    private String reviewText;

    @JsonProperty("star_rating")
    private Integer starRating;
}