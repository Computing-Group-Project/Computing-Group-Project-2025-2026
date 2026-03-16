package com.demeter.backend.ai.controller;

import com.demeter.backend.ai.Service.AIIntegrationService;
import com.demeter.backend.ai.dto.Recommendation.RecommendationRequest;
import com.demeter.backend.ai.dto.Recommendation.RecommendationResponse;
import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final AIIntegrationService aiIntegrationService;
    private final JwtUtil jwtUtil;

    public RecommendationController(AIIntegrationService aiIntegrationService, JwtUtil jwtUtil) {
        this.aiIntegrationService = aiIntegrationService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping
    public ApiResponse<RecommendationResponse> getRecommendations(
            @RequestParam(required = false) Integer cafeteriaId,
            @RequestParam(defaultValue = "homepage") String context,
            @RequestParam(defaultValue = "3") Integer limit,
            HttpServletRequest httpRequest) {

        Long userId = extractUserId(httpRequest);

        RecommendationRequest request = RecommendationRequest.builder()
                .userId(userId.intValue())
                .cafeteriaId(cafeteriaId)
                .context(context)
                .limit(limit)
                .build();

        RecommendationResponse response = aiIntegrationService.getRecommendationsWithFallback(
                request, Collections.emptyList());

        return new ApiResponse<>(true, ApiResponseMessages.RECOMMENDATIONS_FETCHED, response);
    }

    private Long extractUserId(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return jwtUtil.extractUserId(header.substring(7));
        }
        throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
    }
}
