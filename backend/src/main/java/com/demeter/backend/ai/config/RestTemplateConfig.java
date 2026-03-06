package com.demeter.backend.ai.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;
import java.time.Duration;

@Configuration
public class RestTemplateConfig {

    private final AIServiceConfig config;

    public RestTemplateConfig(AIServiceConfig config) {
        this.config = config;
    }

    @Bean(name = "aiServiceRestTemplate")
    public RestTemplate aiServiceRestTemplate(RestTemplateBuilder builder) {
        return builder
                .rootUri(config.getBaseUrl())
                .setConnectTimeout(Duration.ofMillis(config.getConnectTimeout()))
                .setReadTimeout(Duration.ofMillis(config.getReadTimeout()))
                .additionalInterceptors((request, body, execution) -> {
                    request.getHeaders().set("X-API-Key", config.getApiKey());
                    request.getHeaders().set("Content-Type", "application/json");
                    return execution.execute(request, body);
                })
                .build();
    }
}