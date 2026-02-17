// AIIntegrationService.java (Interface)
package com.demeter.ai.service;

import com.demeter.backend.ai.dto.recommendation.*;
import java.util.List;

public interface AIIntegrationService {
    RecommendationResponseDTO getRecommendations(RecommendationRequestDTO request);
    RecommendationResponseDTO getRecommendationsWithFallback(
            RecommendationRequestDTO request,
            List<Integer> fallbackItemIds
    );
    boolean isAIServiceAvailable();
}

