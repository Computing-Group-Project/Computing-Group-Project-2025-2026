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
public class DiscountRuleDTO {
    private Long ruleId;
    private String ruleName;
    private String ruleDescription;
    private Long promotionId;
    private DiscountType ruleType;
    private Double ruleValue;
    private Double minOrderAmount;
    private Double maxOrderAmount;
    private Integer minItemCount;
    private Integer maxItemCount;
    private String eligibleItemCategories;
    private String eligibleUserRoles;
    private PromotionStatus status;
    private Boolean stackable;
    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveUntil;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
