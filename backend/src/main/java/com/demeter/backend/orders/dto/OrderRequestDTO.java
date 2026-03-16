package com.demeter.backend.orders.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderRequestDTO {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Cafeteria ID is required")
    private Long cafeteriaId;

    @NotNull(message = "Total amount is required")
    @Positive(message = "Total amount must be positive")
    private BigDecimal totalAmount;

    private String specialInstructions;

    private Integer appliedDiscountId;

    @NotEmpty(message = "Order must contain at least one item")
    @Valid
    private List<OrderItemDTO> items;

    @Data
    public static class OrderItemDTO {
        @NotNull(message = "Menu item ID is required")
        private Long menuItemId;

        @NotNull(message = "Quantity is required")
        @Min(value = 1, message = "Quantity must be at least 1")
        private Integer quantity;

        @NotNull(message = "Unit price is required")
        @Positive(message = "Unit price must be positive")
        private BigDecimal unitPrice;

        private BigDecimal subtotal;
    }
}
