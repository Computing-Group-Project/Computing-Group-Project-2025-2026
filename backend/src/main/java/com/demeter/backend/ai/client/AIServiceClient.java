package com.demeter.backend.ai.client;

import com.demeter.ai.config.AIServiceConfig;
import com.demeter.ai.dto.recommendation.*;
import com.demeter.ai.exception.*;
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

    public AIServiceClient(@Qualifier("aiServiceRestTemplate") RestTemplate restTemplate,
                           AIServiceConfig config) {
        this.restTemplate = restTemplate;
        this.config = config;
    }

    public RecommendationResponseDTO getRecommendations(RecommendationRequestDTO request) {
        return executeWithRetry(() -> {
            try {
                log.info("Calling AI Service for recommendations - User: {}", request.getUserId());

                HttpEntity<RecommendationRequestDTO> entity = new HttpEntity<>(request);
                ResponseEntity<RecommendationResponseDTO> response = restTemplate.exchange(
                        config.getRecommendationsEndpoint(),
                        HttpMethod.POST,
                        entity,
                        RecommendationResponseDTO.class
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

    private <T> T executeWithRetry(SupplierWithException<T> operation, String opName) {
        int attempts = 0;
        Exception lastException = null;

        while (attempts < config.getMaxRetries()) {
            try {
                return operation.get();
            } catch (AIServiceUnavailableException e) {
                lastException = e;
                attempts++;

                if (attempts < config.getMaxRetries()) {
                    log.warn("Retry attempt {} for {}", attempts, opName);
                    try {
                        Thread.sleep(config.getRetryDelayMs() * attempts);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        throw new AIServiceException("Retry interrupted", ie, opName, 500);
                    }
                }
            }
        }
        throw (AIServiceUnavailableException) lastException;
    }

    @FunctionalInterface
    private interface SupplierWithException<T> {
        T get() throws Exception;
    }
}