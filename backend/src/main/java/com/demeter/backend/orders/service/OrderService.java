package com.demeter.backend.orders.service;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.enums.OrderStatus;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.orders.repo.OrderRepository;
import com.demeter.backend.shared.util.LogActivity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class OrderService {
    private final OrderRepository repo;

    public OrderService(OrderRepository repo) {
        this.repo = repo;
    }

    @Transactional
    @LogActivity(action = "PLACE_ORDER", targetTable = "ORDER")
    public Order placeOrder(Order order) {
        order.setStatus(OrderStatus.PLACED);
        return repo.save(order);
    }

    @Transactional
    @LogActivity(action = "UPDATE_ORDER_STATUS", targetTable = "ORDER")
    public Order updateStatus(Long id, OrderStatus status) {
        Order order = repo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

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
