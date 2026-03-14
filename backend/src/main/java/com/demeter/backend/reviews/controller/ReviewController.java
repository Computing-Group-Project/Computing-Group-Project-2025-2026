package com.demeter.backend.reviews.controller;

import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.reviews.dto.ReviewRequestDTO;
import com.demeter.backend.reviews.model.Review;
import com.demeter.backend.reviews.service.ReviewService;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtUtil jwtUtil;

    public ReviewController(ReviewService reviewService, JwtUtil jwtUtil) {
        this.reviewService = reviewService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ApiResponse<Review> submitReview(@Valid @RequestBody ReviewRequestDTO request,
                                            HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        return new ApiResponse<>(true, ApiResponseMessages.REVIEW_SUBMITTED,
                reviewService.submitReview(request, userId));
    }

    @GetMapping("/cafeteria/{cafeteriaId}")
    public ApiResponse<List<Review>> getReviewsByCafeteria(@PathVariable Integer cafeteriaId) {
        return new ApiResponse<>(true, ApiResponseMessages.REVIEWS_FETCHED,
                reviewService.getReviewsByCafeteria(cafeteriaId));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Review>> getReviewsByUser(@PathVariable Long userId) {
        return new ApiResponse<>(true, ApiResponseMessages.REVIEWS_FETCHED,
                reviewService.getReviewsByUser(userId));
    }

    private Long extractUserId(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return jwtUtil.extractUserId(header.substring(7));
        }
        throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
    }
}
