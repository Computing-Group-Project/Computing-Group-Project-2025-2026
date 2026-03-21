package com.demeter.backend.ai.Service;

import com.demeter.backend.ai.dto.Recommendation.RecommendationRequest;
import com.demeter.backend.ai.dto.Recommendation.RecommendationResponse;
import java.util.List;

public interface AIIntegrationService {
    RecommendationResponse getRecommendations(RecommendationRequest request);
    RecommendationResponse getRecommendationsWithFallback(
            RecommendationRequest request,
            List<Integer> fallbackItemIds
    );
    boolean isAIServiceAvailable();
}