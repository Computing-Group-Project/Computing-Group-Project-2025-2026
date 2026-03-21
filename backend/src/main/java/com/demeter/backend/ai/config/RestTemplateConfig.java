package com.demeter.backend.ai.config;

import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;

@Configuration
public class RestTemplateConfig {

    private final AIServiceConfig config;

    public RestTemplateConfig(AIServiceConfig config) {
        this.config = config;
    }

    @Bean(name = "aiServiceRestTemplate")
    public RestTemplate aiServiceRestTemplate(RestTemplateBuilder builder) {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(config.getConnectTimeout());
        factory.setReadTimeout(config.getReadTimeout());

        return builder
                .requestFactory(() -> factory)
                .build();
    }
}
