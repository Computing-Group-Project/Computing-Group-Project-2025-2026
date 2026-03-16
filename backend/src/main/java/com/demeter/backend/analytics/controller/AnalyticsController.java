package com.demeter.backend.analytics.controller;

import com.demeter.backend.analytics.dto.AnalyticsDTO;
import com.demeter.backend.analytics.dto.AnalyticsDTO.PeriodRevenue;
import com.demeter.backend.analytics.service.AnalyticsService;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/dashboard")
    public ApiResponse<AnalyticsDTO> getDashboardAnalytics(
            @RequestParam(defaultValue = "monthly") String period) {
        AnalyticsDTO analytics = analyticsService.getDashboardAnalytics(period);
        return new ApiResponse<>(true, ApiResponseMessages.ANALYTICS_FETCHED, analytics);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue")
    public ApiResponse<List<PeriodRevenue>> getRevenueByPeriod(
            @RequestParam(defaultValue = "monthly") String period) {
        List<PeriodRevenue> revenue = analyticsService.getRevenueByPeriod(period);
        return new ApiResponse<>(true, ApiResponseMessages.ANALYTICS_FETCHED, revenue);
    }
}
