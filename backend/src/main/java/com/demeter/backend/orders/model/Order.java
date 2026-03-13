package com.demeter.backend.orders.model;

import com.demeter.backend.shared.enums.OrderStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "`Order`")
public class Order {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private Long userId;
    private Long cafeteriaId;
    private Double totalAmount;

    // Discount and promotion fields
    private String appliedPromoCode;
    private Double discountAmount = 0.0;
    private Double finalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "order_status")
    private OrderStatus status;

    @Column(name = "placed_at")
    private LocalDateTime createdAt;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "special_instructions", columnDefinition = "TEXT")
    private String specialInstructions;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items;

    // Constructors
    public Order() {}

    public Order(Long userId, Long cafeteriaId, Double totalAmount) {
        this.userId = userId;
        this.cafeteriaId = cafeteriaId;
        this.totalAmount = totalAmount;
        this.status = OrderStatus.PLACED;
        this.createdAt = LocalDateTime.now();
    }

}
