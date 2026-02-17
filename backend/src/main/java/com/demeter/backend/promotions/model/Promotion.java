package com.demeter.backend.promotions.model;

import com.demeter.backend.shared.enums.DiscountType;
import com.demeter.backend.shared.enums.PromotionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "promotions")
public class Promotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long promotionId;

    private String name;
    private String description;

    @Enumerated(EnumType.STRING)
    private DiscountType discountType;

    private Double discountValue;  // Percentage or Fixed Amount
    private Double minOrderAmount;  // Minimum order amount to apply this promotion
    private Integer maxUsageCount;  // Maximum number of times this promotion can be used
    private Integer currentUsageCount = 0;  // Current usage count

    @Enumerated(EnumType.STRING)
    private PromotionStatus status = PromotionStatus.ACTIVE;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    private Long cafeteriaId;  // Which cafeteria this promotion is applicable to

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();


    public Promotion(String name, String description, DiscountType discountType, 
                     Double discountValue, Double minOrderAmount) {
        this.name = name;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount;
    }

    // Helper method to check if promotion is still valid
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        
        // Check status
        if (status != PromotionStatus.ACTIVE) {
            return true;
        }

        // Check date range
        if (startDate != null && now.isBefore(startDate)) {
            return true;
        }

        if (endDate != null && now.isAfter(endDate)) {
            return true;
        }

        // Check usage limit
        if (maxUsageCount != null && currentUsageCount >= maxUsageCount) {
            return true;
        }

        return false;
    }

    // Helper method to calculate discount amount for a given order total
    public Double calculateDiscount(Double orderTotal) {
        if (isValid()) {
            return 0.0;
        }

        if (orderTotal < minOrderAmount) {
            return 0.0;
        }

        if (discountType == DiscountType.PERCENTAGE) {
            return (orderTotal * discountValue) / 100.0;
        } else if (discountType == DiscountType.FIXED_AMOUNT) {
            return discountValue;
        }

        return 0.0;
    }
}
