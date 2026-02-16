package com.demeter.backend.promotions.dto;

import com.demeter.backend.shared.enums.PromotionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromoCodeDTO {
    private Long promoCodeId;
    private String code;
    private String description;
    private Long promotionId;
    private PromotionStatus status;
    private Integer maxUsageCount;
    private Integer currentUsageCount;
    private LocalDateTime validFrom;
    private LocalDateTime validUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
