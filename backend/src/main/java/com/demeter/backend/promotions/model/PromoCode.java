package com.demeter.backend.promotions.model;

import com.demeter.backend.shared.enums.PromotionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "promo_codes")
public class PromoCode {
    // Getters and Setters
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long promoCodeId;

    @Column(unique = true, nullable = false)
    private String code;  // Unique promo code (e.g., "SAVE20")

    private String description;

    @ManyToOne(optional = false)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Enumerated(EnumType.STRING)
    private PromotionStatus status = PromotionStatus.ACTIVE;

    private Integer maxUsageCount;  // Maximum number of times this code can be used
    private Integer currentUsageCount = 0;  // Current usage count

    private LocalDateTime validFrom;
    private LocalDateTime validUntil;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();


    public PromoCode(String code, Promotion promotion) {
        this.code = code;
        this.promotion = promotion;
    }

    // Helper method to check if promo code is valid
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();

        // Check status
        if (status != PromotionStatus.ACTIVE) {
            return false;
        }

        // Check date range
        if (validFrom != null && now.isBefore(validFrom)) {
            return false;
        }

        if (validUntil != null && now.isAfter(validUntil)) {
            return false;
        }

        // Check usage limit
        if (maxUsageCount != null && currentUsageCount >= maxUsageCount) {
            return false;
        }

        // Check if underlying promotion is valid
        return promotion == null || !promotion.isValid();
    }

    // Helper method to get discount from associated promotion
    public Double getDiscount(Double orderTotal) {
        if (!isValid() || promotion == null) {
            return 0.0;
        }
        return promotion.calculateDiscount(orderTotal);
    }
}
