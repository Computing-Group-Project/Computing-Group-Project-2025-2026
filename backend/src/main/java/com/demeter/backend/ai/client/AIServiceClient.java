package com.demeter.backend.ai.client;

import com.demeter.backend.ai.config.AIServiceConfig;
import com.demeter.backend.ai.dto.Discount.DiscountGenerationRequest;
import com.demeter.backend.ai.dto.Discount.DiscountGenerationResponse;
import com.demeter.backend.ai.dto.Recommendation.RecommendationRequest;
import com.demeter.backend.ai.dto.Recommendation.RecommendationResponse;
import com.demeter.backend.ai.dto.Review.ReviewAnalysisRequest;
import com.demeter.backend.ai.dto.Review.ReviewAnalysisResponse;
import com.demeter.backend.ai.exception.AIServiceException;
import com.demeter.backend.ai.exception.AIServiceUnavailableException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.*;

@Slf4j
@Component
public class AIServiceClient {

    private final RestTemplate restTemplate;
    private final AIServiceConfig config;
    private final ObjectMapper objectMapper;

    public AIServiceClient(@Qualifier("aiServiceRestTemplate") RestTemplate restTemplate,
                           AIServiceConfig config,
                           ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.config = config;
        this.objectMapper = objectMapper;
    }

    private HttpHeaders buildHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("X-API-Key", config.getApiKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public RecommendationResponse getRecommendations(RecommendationRequest request) {
        return executeWithRetry(() -> {
            try {
                log.info("Calling AI Service for recommendations - User: {}", request.getUserId());

                HttpEntity<RecommendationRequest> entity = new HttpEntity<>(request, buildHeaders());
                ResponseEntity<RecommendationResponse> response = restTemplate.exchange(
                        config.getBaseUrl() + config.getRecommendationsEndpoint(),
                        HttpMethod.POST,
                        entity,
                        RecommendationResponse.class
                );

                return response.getBody();

            } catch (HttpClientErrorException | HttpServerErrorException e) {
                throw new AIServiceException(
                        "Failed to get recommendations: " + e.getMessage(),
                        e,
                        "RecommendationService",
                        e.getStatusCode().value()
                );
            } catch (ResourceAccessException e) {
                throw new AIServiceUnavailableException(
                        "Cannot connect to AI Service",
                        e,
                        "RecommendationService"
                );
            }
        }, "getRecommendations");
    }

    public DiscountGenerationResponse generateDiscounts(DiscountGenerationRequest request) {
        return executeWithRetry(() -> {
            try {
                String jsonBody = objectMapper.writeValueAsString(request);
                log.info("Calling AI Service for discount generation - Cafeteria: {} | JSON: {}", request.getCafeteriaId(), jsonBody);

                HttpEntity<String> entity = new HttpEntity<>(jsonBody, buildHeaders());
                ResponseEntity<DiscountGenerationResponse> response = restTemplate.exchange(
                        config.getBaseUrl() + config.getDiscountsEndpoint(),
                        HttpMethod.POST,
                        entity,
                        DiscountGenerationResponse.class
                );

                return response.getBody();

            } catch (HttpClientErrorException | HttpServerErrorException e) {
                log.error("AI Service error response [{}]: {}", e.getStatusCode(), e.getResponseBodyAsString());
                throw new AIServiceException(
                        "Failed to generate discounts: " + e.getMessage(),
                        e,
                        "DiscountGenerationService",
                        e.getStatusCode().value()
                );
            } catch (ResourceAccessException e) {
                throw new AIServiceUnavailableException(
                        "Cannot connect to AI Service",
                        e,
                        "DiscountGenerationService"
                );
            }
        }, "generateDiscounts");
    }

    public ReviewAnalysisResponse analyzeReview(ReviewAnalysisRequest request) {
        return executeWithRetry(() -> {
            try {
                log.info("Calling AI Service for review analysis - Review: {}", request.getReviewId());

                HttpEntity<ReviewAnalysisRequest> entity = new HttpEntity<>(request, buildHeaders());
                ResponseEntity<ReviewAnalysisResponse> response = restTemplate.exchange(
                        config.getBaseUrl() + config.getReviewAnalysisEndpoint(),
                        HttpMethod.POST,
                        entity,
                        ReviewAnalysisResponse.class
                );

                return response.getBody();

            } catch (HttpClientErrorException | HttpServerErrorException e) {
                throw new AIServiceException(
                        "Failed to analyze review: " + e.getMessage(),
                        e,
                        "ReviewAnalysisService",
                        e.getStatusCode().value()
                );
            } catch (ResourceAccessException e) {
                throw new AIServiceUnavailableException(
                        "Cannot connect to AI Service",
                        e,
                        "ReviewAnalysisService"
                );
            }
        }, "analyzeReview");
    }

    private <T> T executeWithRetry(SupplierWithException<T> operation, String opName) {
        int attempts = 0;
        Exception lastException = null;

        while (attempts < config.getMaxRetries()) {
            try {
                return operation.get();
            } catch (Exception e) {
                lastException = e;
                attempts++;

                if (attempts < config.getMaxRetries()) {
                    log.warn("Retry attempt {} for {} - {}", attempts, opName, e.getMessage());
                    try {
                        Thread.sleep(config.getRetryDelayMs() * attempts);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new AIServiceException("Retry interrupted", ie, opName, 500);
                    }
                }
            }
        }
        if (lastException instanceof AIServiceUnavailableException) {
            throw (AIServiceUnavailableException) lastException;
        }
        throw new AIServiceException("AI service call failed after " + config.getMaxRetries() + " retries",
                lastException, opName, 500);
    }

    @FunctionalInterface
    private interface SupplierWithException<T> {
        T get() throws Exception;
    }
}