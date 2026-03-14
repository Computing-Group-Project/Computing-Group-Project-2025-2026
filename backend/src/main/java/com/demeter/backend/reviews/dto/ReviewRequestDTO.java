package com.demeter.backend.reviews.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ReviewRequestDTO {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Cafeteria ID is required")
    private Integer cafeteriaId;

    @NotNull(message = "Star rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private Integer starRating;

    @Size(max = 200, message = "Review text must not exceed 200 characters")
    private String reviewText;

    public ReviewRequestDTO() {}

}
