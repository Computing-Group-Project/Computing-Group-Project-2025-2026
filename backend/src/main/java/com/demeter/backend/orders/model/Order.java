package com.demeter.backend.orders.model;

import com.demeter.backend.shared.enums.OrderStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Entity
@Table(name = "`Order`")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @NotNull(message = "User ID is required")
    @Column(name = "user_id")
    private Long userId;

    @NotNull(message = "Cafeteria ID is required")
    @Column(name = "cafeteria_id")
    private Long cafeteriaId;

    @Column(name = "total_amount", precision = 10, scale = 2)
    private BigDecimal totalAmount;

    // Discount and promotion fields (not persisted — computed at checkout)
    @Transient
    private Integer appliedDiscountId;
    @Transient
    private String appliedPromoCode;
    @Transient
    private BigDecimal discountAmount = BigDecimal.ZERO;
    @Transient
    private BigDecimal finalAmount;

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

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<OrderItem> items;

    public Order() {}

    public Order(Long userId, Long cafeteriaId, BigDecimal totalAmount) {
        this.userId = userId;
        this.cafeteriaId = cafeteriaId;
        this.totalAmount = totalAmount;
        this.status = OrderStatus.PLACED;
        this.createdAt = LocalDateTime.now();
    }

}
