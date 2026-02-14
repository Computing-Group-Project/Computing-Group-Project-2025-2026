package com.demeter.backend.orders.service;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.orders.repo.OrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    public Order placeOrder(Order order) {
        order.setStatus(OrderStatus.PLACED);
        return repo.save(order);
    }

    public Order updateStatus(Long id, OrderStatus status) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
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

