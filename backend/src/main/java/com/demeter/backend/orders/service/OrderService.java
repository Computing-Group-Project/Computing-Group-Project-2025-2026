package com.demeter.backend.orders.service;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.shared.util.LogActivity; // Added import
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    // Task 08: Capture the full order object upon placement
    @Transactional
    @LogActivity(action = "PLACE_ORDER", targetTable = "ORDER")
    public Order placeOrder(Order order) {
        order.setStatus(OrderStatus.PLACED);
        return repo.save(order);
    }

    // Task 08: Capture the transition of order statuses
    @Transactional
    @LogActivity(action = "UPDATE_ORDER_STATUS", targetTable = "ORDER")
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // Note: The Aspect will capture the 'Order' state before and after this change
        order.setStatus(status);
        return repo.save(order);
    }

    public List<Order> getOrdersByUser(Long userId) {
        return repo.findByUserId(userId);
    }

    public List<Order> getAllOrders() {
        return repo.findAll();
    }
}