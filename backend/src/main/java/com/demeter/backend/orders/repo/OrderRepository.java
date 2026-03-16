package com.demeter.backend.orders.repo;

import com.demeter.backend.orders.model.Order;
import com.demeter.backend.shared.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);
    List<Order> findByCafeteriaIdAndStatusIn(Long cafeteriaId, List<OrderStatus> statuses);
    List<Order> findByCafeteriaId(Long cafeteriaId);
}
