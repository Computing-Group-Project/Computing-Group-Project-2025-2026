package com.demeter.backend.analytics.controller;

import com.demeter.backend.analytics.dto.AnalyticsDTO;
import com.demeter.backend.analytics.dto.AnalyticsDTO.PeriodRevenue;
import com.demeter.backend.analytics.service.AnalyticsService;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
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
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        AnalyticsDTO analytics = analyticsService.getDashboardAnalytics(period, startDate, endDate);
        return new ApiResponse<>(true, ApiResponseMessages.ANALYTICS_FETCHED, analytics);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/revenue")
    public ApiResponse<List<PeriodRevenue>> getRevenueByPeriod(
            @RequestParam(defaultValue = "monthly") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        List<PeriodRevenue> revenue = analyticsService.getRevenueByPeriod(period, startDate, endDate);
        return new ApiResponse<>(true, ApiResponseMessages.ANALYTICS_FETCHED, revenue);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAnalytics(
            @RequestParam(defaultValue = "monthly") String period) {
        String csv = analyticsService.exportDashboardAsCsv(period);
        byte[] content = csv.getBytes();
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=analytics-" + period + ".csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(content.length)
                .body(content);
    }
}
