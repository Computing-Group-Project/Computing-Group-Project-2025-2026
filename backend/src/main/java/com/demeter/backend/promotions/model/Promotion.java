package com.demeter.backend.promotions.model;

import com.demeter.backend.shared.enums.DiscountType;
import com.demeter.backend.shared.enums.PromotionStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    // Constructors
    public Promotion() {}

    public Promotion(String name, String description, DiscountType discountType, 
                     Double discountValue, Double minOrderAmount) {
        this.name = name;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderAmount = minOrderAmount;
        this.status = PromotionStatus.ACTIVE;
    }

    // Getters and Setters
    public Long getPromotionId() { return promotionId; }
    public void setPromotionId(Long promotionId) { this.promotionId = promotionId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }

    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }

    public Double getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public Integer getMaxUsageCount() { return maxUsageCount; }
    public void setMaxUsageCount(Integer maxUsageCount) { this.maxUsageCount = maxUsageCount; }

    public Integer getCurrentUsageCount() { return currentUsageCount; }
    public void setCurrentUsageCount(Integer currentUsageCount) { this.currentUsageCount = currentUsageCount; }

    public PromotionStatus getStatus() { return status; }
    public void setStatus(PromotionStatus status) { this.status = status; }

    public LocalDateTime getStartDate() { return startDate; }
    public void setStartDate(LocalDateTime startDate) { this.startDate = startDate; }

    public LocalDateTime getEndDate() { return endDate; }
    public void setEndDate(LocalDateTime endDate) { this.endDate = endDate; }

    public Long getCafeteriaId() { return cafeteriaId; }
    public void setCafeteriaId(Long cafeteriaId) { this.cafeteriaId = cafeteriaId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper method to check if promotion is still valid
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();
        
        // Check status
        if (status != PromotionStatus.ACTIVE) {
            return false;
        }

        // Check date range
        if (startDate != null && now.isBefore(startDate)) {
            return false;
        }

        if (endDate != null && now.isAfter(endDate)) {
            return false;
        }

        // Check usage limit
        if (maxUsageCount != null && currentUsageCount >= maxUsageCount) {
            return false;
        }

        return true;
    }

    // Helper method to calculate discount amount for a given order total
    public Double calculateDiscount(Double orderTotal) {
        if (!isValid()) {
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
