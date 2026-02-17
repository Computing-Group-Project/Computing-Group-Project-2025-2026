package com.demeter.backend.promotions.dto;

import com.demeter.backend.shared.enums.DiscountType;
import com.demeter.backend.shared.enums.PromotionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionDTO {
    private Long promotionId;
    private String name;
    private String description;
    private DiscountType discountType;
    private Double discountValue;
    private Double minOrderAmount;
    private Integer maxUsageCount;
    private Integer currentUsageCount;
    private PromotionStatus status;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private Long cafeteriaId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
