package com.demeter.backend.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsDTO {

    private long totalOrders;
    private double totalRevenue;
    private double averageOrderValue;
    private long totalStudents;
    private long totalStaff;
    private Map<String, Long> ordersByStatus;
    private List<PeriodRevenue> revenueByPeriod;
    private List<TopItem> topSellingItems;
    private List<CafeteriaStat> cafeteriaStats;
    private List<RecentOrder> recentOrders;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PeriodRevenue {
        private String period;
        private double revenue;
        private long orderCount;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopItem {
        private long itemId;
        private String itemName;
        private long totalQuantity;
        private double totalRevenue;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CafeteriaStat {
        private int cafeteriaId;
        private String cafeteriaName;
        private long orderCount;
        private double revenue;
        private double averageRating;
        private int totalReviews;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentOrder {
        private long orderId;
        private long userId;
        private long cafeteriaId;
        private double totalAmount;
        private String status;
        private LocalDateTime placedAt;
    }
}
