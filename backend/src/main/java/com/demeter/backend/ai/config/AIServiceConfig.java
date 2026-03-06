package com.demeter.backend.ai.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
@ConfigurationProperties(prefix = "demeter.ai-service")
public class AIServiceConfig {
    private String baseUrl = "http://localhost:8001";
    private String apiKey = "demeter-ai-service-key-2024";
    private int connectTimeout = 5000;
    private int readTimeout = 30000;
    private int maxRetries = 3;
    private long retryDelayMs = 1000;

    private String recommendationsEndpoint = "/api/v1/recommendations";
    private String discountsEndpoint = "/api/v1/discounts";
    private String reviewAnalysisEndpoint = "/api/v1/reviews/analyze";

    private boolean enableFallback = true;
    private boolean cacheRecommendations = true;
}