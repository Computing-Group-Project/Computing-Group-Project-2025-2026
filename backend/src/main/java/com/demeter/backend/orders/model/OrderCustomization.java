package com.demeter.backend.orders.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
@Entity
@Table(name = "OrderCustomization")
public class OrderCustomization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_customization_id")
    private Long orderCustomizationId;

    @Column(name = "price_adjustment", precision = 10, scale = 2)
    private BigDecimal priceAdjustment;

    @ManyToOne
    @JoinColumn(name = "order_item_id", nullable = false)
    private OrderItem orderItem;

    public OrderCustomization() {}

    public OrderCustomization(BigDecimal priceAdjustment, OrderItem orderItem) {
        this.priceAdjustment = priceAdjustment;
        this.orderItem = orderItem;
    }
}
