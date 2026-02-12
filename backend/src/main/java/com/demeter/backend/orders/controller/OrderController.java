package com.demeter.backend.orders.controller;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.orders.service.OrderService;
import com.demeter.backend.shared.dto.ApiResponse;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService service;

    public OrderController(OrderService service) {
        this.service = service;
    }

    @PostMapping
    public ApiResponse<Order> placeOrder(@RequestBody Order order) {
        return new ApiResponse<>(true, ApiResponseMessages.ORDER_PLACED, service.placeOrder(order));
    }

    @PutMapping("/{id}/status")
    public ApiResponse<Order> updateStatus(@PathVariable Long id, @RequestParam OrderStatus status) {
        return new ApiResponse<>(true, ApiResponseMessages.ORDER_UPDATED, service.updateStatus(id, status));
    }

    @GetMapping("/user/{userId}")
    public ApiResponse<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        return new ApiResponse<>(true, ApiResponseMessages.ORDERS_FETCHED, service.getOrdersByUser(userId));
    }

    @GetMapping
    public ApiResponse<List<Order>> getAllOrders() {
        return new ApiResponse<>(true, ApiResponseMessages.ALL_ORDERS_FETCHED, service.getAllOrders());
    }
}
