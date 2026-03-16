package com.demeter.backend.config;

import com.demeter.backend.shared.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    @GetMapping("/api/health")
    public ApiResponse<String> health() {
        return new ApiResponse<>(true, "Service is healthy", "UP");
    }
}
