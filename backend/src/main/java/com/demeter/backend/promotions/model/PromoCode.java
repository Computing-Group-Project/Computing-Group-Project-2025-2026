package com.demeter.backend.promotions.model;

import com.demeter.backend.shared.enums.PromotionStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "promo_codes")
public class PromoCode {
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

    // Constructors
    public PromoCode() {}

    public PromoCode(String code, Promotion promotion) {
        this.code = code;
        this.promotion = promotion;
        this.status = PromotionStatus.ACTIVE;
    }

    // Getters and Setters
    public Long getPromoCodeId() { return promoCodeId; }
    public void setPromoCodeId(Long promoCodeId) { this.promoCodeId = promoCodeId; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Promotion getPromotion() { return promotion; }
    public void setPromotion(Promotion promotion) { this.promotion = promotion; }

    public PromotionStatus getStatus() { return status; }
    public void setStatus(PromotionStatus status) { this.status = status; }

    public Integer getMaxUsageCount() { return maxUsageCount; }
    public void setMaxUsageCount(Integer maxUsageCount) { this.maxUsageCount = maxUsageCount; }

    public Integer getCurrentUsageCount() { return currentUsageCount; }
    public void setCurrentUsageCount(Integer currentUsageCount) { this.currentUsageCount = currentUsageCount; }

    public LocalDateTime getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDateTime validFrom) { this.validFrom = validFrom; }

    public LocalDateTime getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDateTime validUntil) { this.validUntil = validUntil; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

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
        if (promotion != null && !promotion.isValid()) {
            return false;
        }

        return true;
    }

    // Helper method to get discount from associated promotion
    public Double getDiscount(Double orderTotal) {
        if (!isValid() || promotion == null) {
            return 0.0;
        }
        return promotion.calculateDiscount(orderTotal);
    }
}
