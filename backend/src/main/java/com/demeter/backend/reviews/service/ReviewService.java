package com.demeter.backend.reviews.service;

import com.demeter.backend.ai.client.AIServiceClient;
import com.demeter.backend.ai.dto.Review.ReviewAnalysisRequest;
import com.demeter.backend.ai.dto.Review.ReviewAnalysisResponse;
import com.demeter.backend.cafeteria.model.Cafeteria;
import com.demeter.backend.cafeteria.repo.CafeteriaRepository;
import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.reviews.dto.ReviewRequestDTO;
import com.demeter.backend.reviews.model.Review;
import com.demeter.backend.reviews.repo.ReviewRepository;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.shared.exception.AppException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;
    private final CafeteriaRepository cafeteriaRepository;
    private final AIServiceClient aiServiceClient;

    public ReviewService(ReviewRepository reviewRepository,
                         OrderRepository orderRepository,
                         CafeteriaRepository cafeteriaRepository,
                         AIServiceClient aiServiceClient) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
        this.cafeteriaRepository = cafeteriaRepository;
        this.aiServiceClient = aiServiceClient;
    }

    @Transactional
    public Review submitReview(ReviewRequestDTO request, Long userId) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }

        if (reviewRepository.findByOrderId(request.getOrderId()).isPresent()) {
            throw new AppException(ErrorCode.REVIEW_ALREADY_EXISTS);
        }

        if (order.getCompletedAt() != null &&
                order.getCompletedAt().plusHours(1).isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.REVIEW_WINDOW_EXPIRED);
        }

        Review review = new Review();
        review.setUserId(userId);
        review.setCafeteriaId(request.getCafeteriaId());
        review.setOrderId(request.getOrderId());
        review.setStarRating(request.getStarRating());
        review.setReviewText(request.getReviewText());
        review.setIsApproved(true);
        review.setExpiresAt(order.getCompletedAt() != null
                ? order.getCompletedAt().plusHours(1)
                : LocalDateTime.now().plusHours(1));

        Review saved = reviewRepository.save(review);

        // Asynchronously analyze sentiment via AI service
        try {
            if (request.getReviewText() != null && !request.getReviewText().isBlank()) {
                ReviewAnalysisRequest analysisRequest = ReviewAnalysisRequest.builder()
                        .reviewId(saved.getReviewId().intValue())
                        .reviewText(request.getReviewText())
                        .starRating(request.getStarRating())
                        .build();
                ReviewAnalysisResponse analysis = aiServiceClient.analyzeReview(analysisRequest);
                if (analysis != null) {
                    saved.setSentimentScore(analysis.getSentimentScore() != null
                            ? BigDecimal.valueOf(analysis.getSentimentScore()) : null);
                    saved.setKeywords(analysis.getKeywords() != null
                            ? String.join(",", analysis.getKeywords()) : null);
                    saved = reviewRepository.save(saved);
                }
            }
        } catch (Exception e) {
            log.warn("AI sentiment analysis failed for review {}: {}", saved.getReviewId(), e.getMessage());
        }

        updateCafeteriaRating(request.getCafeteriaId());

        return saved;
    }

    public List<Review> getReviewsByCafeteria(Integer cafeteriaId) {
        return reviewRepository.findByCafeteriaId(cafeteriaId);
    }

    public List<Review> getReviewsByUser(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    private void updateCafeteriaRating(Integer cafeteriaId) {
        Cafeteria cafeteria = cafeteriaRepository.findById(cafeteriaId)
                .orElseThrow(() -> new AppException(ErrorCode.CAFETERIA_NOT_FOUND));

        List<Review> reviews = reviewRepository.findByCafeteriaId(cafeteriaId);
        if (!reviews.isEmpty()) {
            double avg = reviews.stream()
                    .mapToInt(Review::getStarRating)
                    .average()
                    .orElse(0.0);
            cafeteria.setAverageRating(BigDecimal.valueOf(avg).setScale(2, RoundingMode.HALF_UP));
            cafeteria.setTotalReviews(reviews.size());
            cafeteriaRepository.save(cafeteria);
        }
    }
}
