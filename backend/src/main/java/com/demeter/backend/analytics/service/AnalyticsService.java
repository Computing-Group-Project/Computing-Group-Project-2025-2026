package com.demeter.backend.analytics.service;

import com.demeter.backend.analytics.dto.AnalyticsDTO;
import com.demeter.backend.analytics.dto.AnalyticsDTO.CafeteriaStat;
import com.demeter.backend.analytics.dto.AnalyticsDTO.PeriodRevenue;
import com.demeter.backend.analytics.dto.AnalyticsDTO.RecentOrder;
import com.demeter.backend.analytics.dto.AnalyticsDTO.TopItem;
import com.demeter.backend.cafeteria.model.Cafeteria;
import com.demeter.backend.cafeteria.repo.CafeteriaRepository;
import com.demeter.backend.menu.model.Menu;
import com.demeter.backend.menu.repo.MenuRepository;
import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.model.OrderItem;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.IsoFields;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CafeteriaRepository cafeteriaRepository;
    private final MenuRepository menuRepository;

    public AnalyticsService(OrderRepository orderRepository,
                            UserRepository userRepository,
                            CafeteriaRepository cafeteriaRepository,
                            MenuRepository menuRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cafeteriaRepository = cafeteriaRepository;
        this.menuRepository = menuRepository;
    }

    public AnalyticsDTO getDashboardAnalytics(String period, LocalDate customStart, LocalDate customEnd) {
        LocalDateTime startDate = customStart != null ? customStart.atStartOfDay() : getStartDate(period);
        LocalDateTime endDate = customEnd != null ? customEnd.plusDays(1).atStartOfDay() : null;
        List<Order> allOrders = orderRepository.findAll();
        final LocalDateTime filterEnd = endDate;
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isAfter(startDate))
                .filter(o -> filterEnd == null || o.getCreatedAt().isBefore(filterEnd))
                .toList();

        long totalOrders = filteredOrders.size();

        double totalRevenue = filteredOrders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
                .sum();

        double averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0.0;

        List<User> allUsers = userRepository.findAll();
        long totalStudents = allUsers.stream().filter(u -> "STUDENT".equals(u.getRole())).count();
        long totalStaff = allUsers.stream().filter(u -> "STAFF".equals(u.getRole())).count();

        Map<String, Long> ordersByStatus = filteredOrders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getStatus().name(),
                        Collectors.counting()
                ));

        List<PeriodRevenue> revenueByPeriod = computeRevenueByPeriod(filteredOrders, period);
        List<TopItem> topSellingItems = computeTopSellingItems(filteredOrders);
        List<CafeteriaStat> cafeteriaStats = computeCafeteriaStats(filteredOrders);
        List<RecentOrder> recentOrders = computeRecentOrders(allOrders);

        return AnalyticsDTO.builder()
                .totalOrders(totalOrders)
                .totalRevenue(totalRevenue)
                .averageOrderValue(averageOrderValue)
                .totalStudents(totalStudents)
                .totalStaff(totalStaff)
                .ordersByStatus(ordersByStatus)
                .revenueByPeriod(revenueByPeriod)
                .topSellingItems(topSellingItems)
                .cafeteriaStats(cafeteriaStats)
                .recentOrders(recentOrders)
                .build();
    }

    public List<PeriodRevenue> getRevenueByPeriod(String period, LocalDate customStart, LocalDate customEnd) {
        LocalDateTime startDate = customStart != null ? customStart.atStartOfDay() : getStartDate(period);
        LocalDateTime endDate = customEnd != null ? customEnd.plusDays(1).atStartOfDay() : null;
        List<Order> allOrders = orderRepository.findAll();
        final LocalDateTime filterEnd = endDate;
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> o.getCreatedAt() != null && o.getCreatedAt().isAfter(startDate))
                .filter(o -> filterEnd == null || o.getCreatedAt().isBefore(filterEnd))
                .toList();
        return computeRevenueByPeriod(filteredOrders, period);
    }

    private LocalDateTime getStartDate(String period) {
        LocalDateTime now = LocalDateTime.now();
        return switch (period != null ? period.toLowerCase() : "monthly") {
            case "daily" -> now.minusDays(30);
            case "weekly" -> now.minusWeeks(12);
            case "monthly" -> now.minusMonths(12);
            case "quarterly" -> now.minusMonths(24);
            default -> now.minusMonths(12);
        };
    }

    private List<PeriodRevenue> computeRevenueByPeriod(List<Order> orders, String period) {
        List<Order> completedOrders = orders.stream()
                .filter(o -> o.getStatus() == OrderStatus.COMPLETED && o.getCreatedAt() != null)
                .toList();

        Map<String, List<Order>> grouped = completedOrders.stream()
                .collect(Collectors.groupingBy(o -> formatPeriodKey(o.getCreatedAt(), period)));

        return grouped.entrySet().stream()
                .map(entry -> PeriodRevenue.builder()
                        .period(entry.getKey())
                        .revenue(entry.getValue().stream()
                                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
                                .sum())
                        .orderCount(entry.getValue().size())
                        .build())
                .sorted(Comparator.comparing(PeriodRevenue::getPeriod))
                .toList();
    }

    private String formatPeriodKey(LocalDateTime dateTime, String period) {
        return switch (period != null ? period.toLowerCase() : "monthly") {
            case "daily" -> dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
            case "weekly" -> dateTime.getYear() + "-W" + String.format("%02d", dateTime.get(IsoFields.WEEK_OF_WEEK_BASED_YEAR));
            case "quarterly" -> dateTime.getYear() + "-Q" + ((dateTime.getMonthValue() - 1) / 3 + 1);
            default -> dateTime.format(DateTimeFormatter.ofPattern("yyyy-MM"));
        };
    }

    private List<TopItem> computeTopSellingItems(List<Order> orders) {
        Map<Long, Long> quantityByItem = new HashMap<>();
        Map<Long, Double> revenueByItem = new HashMap<>();

        for (Order order : orders) {
            if (order.getItems() == null) continue;
            for (OrderItem item : order.getItems()) {
                Long itemId = item.getMenuItemId();
                quantityByItem.merge(itemId, (long) item.getQuantity(), Long::sum);
                revenueByItem.merge(itemId, item.getSubtotal() != null ? item.getSubtotal().doubleValue() : 0.0, Double::sum);
            }
        }

        Map<Long, String> menuNames = menuRepository.findAll().stream()
                .collect(Collectors.toMap(Menu::getMenuId, Menu::getName, (a, b) -> a));

        return quantityByItem.entrySet().stream()
                .sorted(Map.Entry.<Long, Long>comparingByValue().reversed())
                .limit(10)
                .map(entry -> TopItem.builder()
                        .itemId(entry.getKey())
                        .itemName(menuNames.getOrDefault(entry.getKey(), "Unknown Item"))
                        .totalQuantity(entry.getValue())
                        .totalRevenue(revenueByItem.getOrDefault(entry.getKey(), 0.0))
                        .build())
                .toList();
    }

    private List<CafeteriaStat> computeCafeteriaStats(List<Order> orders) {
        Map<Integer, Cafeteria> cafeteriaMap = cafeteriaRepository.findAll().stream()
                .collect(Collectors.toMap(Cafeteria::getCafeteriaId, c -> c));

        Map<Long, List<Order>> ordersByCafeteria = orders.stream()
                .filter(o -> o.getCafeteriaId() != null)
                .collect(Collectors.groupingBy(Order::getCafeteriaId));

        return cafeteriaMap.values().stream()
                .map(cafeteria -> {
                    List<Order> cafOrders = ordersByCafeteria.getOrDefault((long) cafeteria.getCafeteriaId(), Collections.emptyList());
                    double revenue = cafOrders.stream()
                            .filter(o -> o.getStatus() == OrderStatus.COMPLETED)
                            .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
                            .sum();
                    BigDecimal avgRating = cafeteria.getAverageRating();
                    return CafeteriaStat.builder()
                            .cafeteriaId(cafeteria.getCafeteriaId())
                            .cafeteriaName(cafeteria.getName())
                            .orderCount(cafOrders.size())
                            .revenue(revenue)
                            .averageRating(avgRating != null ? avgRating.doubleValue() : 0.0)
                            .totalReviews(cafeteria.getTotalReviews() != null ? cafeteria.getTotalReviews() : 0)
                            .build();
                })
                .sorted(Comparator.comparingInt(CafeteriaStat::getCafeteriaId))
                .toList();
    }

    private List<RecentOrder> computeRecentOrders(List<Order> allOrders) {
        return allOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .sorted(Comparator.comparing(Order::getCreatedAt).reversed())
                .limit(20)
                .map(o -> RecentOrder.builder()
                        .orderId(o.getOrderId())
                        .userId(o.getUserId())
                        .cafeteriaId(o.getCafeteriaId())
                        .totalAmount(o.getTotalAmount() != null ? o.getTotalAmount().doubleValue() : 0.0)
                        .status(o.getStatus().name())
                        .placedAt(o.getCreatedAt())
                        .build())
                .toList();
    }

    public String exportDashboardAsCsv(String period) {
        AnalyticsDTO data = getDashboardAnalytics(period, null, null);
        StringBuilder csv = new StringBuilder();

        csv.append("Metric,Value\n");
        csv.append("Total Orders,").append(data.getTotalOrders()).append("\n");
        csv.append("Total Revenue,").append(String.format("%.2f", data.getTotalRevenue())).append("\n");
        csv.append("Average Order Value,").append(String.format("%.2f", data.getAverageOrderValue())).append("\n");
        csv.append("Total Students,").append(data.getTotalStudents()).append("\n");
        csv.append("Total Staff,").append(data.getTotalStaff()).append("\n");
        csv.append("\n");

        if (data.getOrdersByStatus() != null) {
            csv.append("Order Status,Count\n");
            data.getOrdersByStatus().forEach((status, count) ->
                    csv.append(status).append(",").append(count).append("\n"));
            csv.append("\n");
        }

        if (data.getTopSellingItems() != null) {
            csv.append("Top Item,Quantity,Revenue\n");
            data.getTopSellingItems().forEach(item ->
                    csv.append(item.getItemName()).append(",")
                            .append(item.getTotalQuantity()).append(",")
                            .append(String.format("%.2f", item.getTotalRevenue())).append("\n"));
            csv.append("\n");
        }

        if (data.getCafeteriaStats() != null) {
            csv.append("Cafeteria,Orders,Revenue,Rating,Reviews\n");
            data.getCafeteriaStats().forEach(cafe ->
                    csv.append(cafe.getCafeteriaName()).append(",")
                            .append(cafe.getOrderCount()).append(",")
                            .append(String.format("%.2f", cafe.getRevenue())).append(",")
                            .append(String.format("%.1f", cafe.getAverageRating())).append(",")
                            .append(cafe.getTotalReviews()).append("\n"));
        }

        return csv.toString();
    }
}
