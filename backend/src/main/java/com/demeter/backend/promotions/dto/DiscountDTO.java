package com.demeter.backend.promotions.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DiscountDTO {
    private Integer discountId;

    @NotNull(message = "Cafeteria ID is required")
    private Integer cafeteriaId;

    @NotNull(message = "Discount type is required")
    private String discountType;

    @NotNull(message = "Discount value is required")
    @Positive(message = "Discount value must be positive")
    private BigDecimal discountValue;

    private String applicableItems;
    private String requirements;
    private Boolean aiGenerated;
    private Integer approvedBy;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
