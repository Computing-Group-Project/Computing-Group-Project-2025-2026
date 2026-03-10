package com.demeter.backend.promotions.dto;

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
    private Integer cafeteriaId;
    private String discountType;
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
