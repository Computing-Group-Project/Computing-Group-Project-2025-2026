package com.demeter.backend.orders.controller;

import com.demeter.backend.orders.dto.OrderRequestDTO;
import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.model.OrderItem;
import com.demeter.backend.orders.service.OrderService;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.config.security.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;
    private final JwtUtil jwtUtil;

    public OrderController(OrderService service, JwtUtil jwtUtil) {
        this.service = service;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping
    public ApiResponse<Order> placeOrder(@Valid @RequestBody OrderRequestDTO dto) {
        Order order = new Order();
        order.setUserId(dto.getUserId());
        order.setCafeteriaId(dto.getCafeteriaId());
        order.setTotalAmount(dto.getTotalAmount());
        order.setSpecialInstructions(dto.getSpecialInstructions());
        order.setAppliedDiscountId(dto.getAppliedDiscountId());

        List<OrderItem> items = dto.getItems().stream().map(itemDto -> {
            OrderItem item = new OrderItem();
            item.setMenuItemId(itemDto.getMenuItemId());
            item.setQuantity(itemDto.getQuantity());
            item.setUnitPrice(itemDto.getUnitPrice());
            item.setSubtotal(itemDto.getSubtotal());
            return item;
        }).toList();
        order.setItems(items);

        return new ApiResponse<>(true, ApiResponseMessages.ORDER_PLACED, service.placeOrder(order));
    }

    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @PutMapping("/{id}/status")
    public ApiResponse<Order> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return new ApiResponse<>(true, ApiResponseMessages.ORDER_UPDATED, service.updateStatus(id, status));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrdersByUser(@PathVariable Long userId, HttpServletRequest request) {
        String token = extractToken(request);
        String role = jwtUtil.extractRole(token);

        if (!"STAFF".equals(role) && !"ADMIN".equals(role)) {
            Long tokenUserId = jwtUtil.extractUserId(token);
            if (!userId.equals(tokenUserId)) {
                throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
            }
        }

        return new ApiResponse<>(true, ApiResponseMessages.ORDERS_FETCHED, service.getOrdersByUser(userId));
    }

    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @GetMapping("/cafeteria/{cafeteriaId}")
    public ApiResponse<List<Order>> getOrdersByCafeteria(
            @PathVariable Long cafeteriaId,
            @RequestParam(required = false, defaultValue = "false") boolean activeOnly) {
        List<Order> orders = activeOnly
                ? service.getActiveOrdersByCafeteria(cafeteriaId)
                : service.getOrdersByCafeteria(cafeteriaId);
        return new ApiResponse<>(true, ApiResponseMessages.ORDERS_FETCHED, orders);
    }

    @PreAuthorize("hasAnyRole('STAFF','ADMIN')")
    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return new ApiResponse<>(true, ApiResponseMessages.ALL_ORDERS_FETCHED, service.getAllOrders());
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
    }
}
