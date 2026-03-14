package com.demeter.backend.orders.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "OrderItem")
public class OrderItem {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_item_id")
    private Long orderItemId;

    @Column(name = "item_id")
    private Long menuItemId;

    private int quantity;

    @Column(name = "unit_price")
    private Double unitPrice;

    private Double subtotal;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    // Constructors
    public OrderItem() {}

    public OrderItem(Long menuItemId, int quantity, Double unitPrice, Order order) {
        this.menuItemId = menuItemId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.subtotal = unitPrice * quantity;
        this.order = order;
    }

}
