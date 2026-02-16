package com.demeter.backend.promotions.model;

import com.demeter.backend.shared.enums.DiscountType;
import com.demeter.backend.shared.enums.PromotionStatus;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "discount_rules")
public class DiscountRule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ruleId;

    private String ruleName;
    private String ruleDescription;

    @ManyToOne(optional = true)
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Enumerated(EnumType.STRING)
    private DiscountType ruleType;

    private Double ruleValue;  // Discount value (percentage or fixed amount)

    // Eligibility conditions
    private Double minOrderAmount;
    private Double maxOrderAmount;
    private Integer minItemCount;
    private Integer maxItemCount;

    @Column(length = 500)
    private String eligibleItemCategories;  // Comma-separated list of categories

    @Column(length = 500)
    private String eligibleUserRoles;  // Comma-separated list of user roles

    @Enumerated(EnumType.STRING)
    private PromotionStatus status = PromotionStatus.ACTIVE;

    private Boolean isStackable = false;  // Can this rule be combined with other discounts?

    private LocalDateTime effectiveFrom;
    private LocalDateTime effectiveUntil;

    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public DiscountRule() {}

    public DiscountRule(String ruleName, DiscountType ruleType, Double ruleValue) {
        this.ruleName = ruleName;
        this.ruleType = ruleType;
        this.ruleValue = ruleValue;
        this.status = PromotionStatus.ACTIVE;
    }

    // Getters and Setters
    public Long getRuleId() { return ruleId; }
    public void setRuleId(Long ruleId) { this.ruleId = ruleId; }

    public String getRuleName() { return ruleName; }
    public void setRuleName(String ruleName) { this.ruleName = ruleName; }

    public String getRuleDescription() { return ruleDescription; }
    public void setRuleDescription(String ruleDescription) { this.ruleDescription = ruleDescription; }

    public Promotion getPromotion() { return promotion; }
    public void setPromotion(Promotion promotion) { this.promotion = promotion; }

    public DiscountType getRuleType() { return ruleType; }
    public void setRuleType(DiscountType ruleType) { this.ruleType = ruleType; }

    public Double getRuleValue() { return ruleValue; }
    public void setRuleValue(Double ruleValue) { this.ruleValue = ruleValue; }

    public Double getMinOrderAmount() { return minOrderAmount; }
    public void setMinOrderAmount(Double minOrderAmount) { this.minOrderAmount = minOrderAmount; }

    public Double getMaxOrderAmount() { return maxOrderAmount; }
    public void setMaxOrderAmount(Double maxOrderAmount) { this.maxOrderAmount = maxOrderAmount; }

    public Integer getMinItemCount() { return minItemCount; }
    public void setMinItemCount(Integer minItemCount) { this.minItemCount = minItemCount; }

    public Integer getMaxItemCount() { return maxItemCount; }
    public void setMaxItemCount(Integer maxItemCount) { this.maxItemCount = maxItemCount; }

    public String getEligibleItemCategories() { return eligibleItemCategories; }
    public void setEligibleItemCategories(String eligibleItemCategories) { 
        this.eligibleItemCategories = eligibleItemCategories; 
    }

    public String getEligibleUserRoles() { return eligibleUserRoles; }
    public void setEligibleUserRoles(String eligibleUserRoles) { 
        this.eligibleUserRoles = eligibleUserRoles; 
    }

    public PromotionStatus getStatus() { return status; }
    public void setStatus(PromotionStatus status) { this.status = status; }

    public Boolean getStackable() { return isStackable; }
    public void setStackable(Boolean stackable) { isStackable = stackable; }

    public LocalDateTime getEffectiveFrom() { return effectiveFrom; }
    public void setEffectiveFrom(LocalDateTime effectiveFrom) { this.effectiveFrom = effectiveFrom; }

    public LocalDateTime getEffectiveUntil() { return effectiveUntil; }
    public void setEffectiveUntil(LocalDateTime effectiveUntil) { this.effectiveUntil = effectiveUntil; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    // Helper method to check if rule is valid
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();

        // Check status
        if (status != PromotionStatus.ACTIVE) {
            return false;
        }

        // Check date range
        if (effectiveFrom != null && now.isBefore(effectiveFrom)) {
            return false;
        }

        if (effectiveUntil != null && now.isAfter(effectiveUntil)) {
            return false;
        }

        return true;
    }

    // Helper method to check if order qualifies for this rule
    public boolean qualifiesForRule(Double orderAmount, Integer itemCount, String userRole) {
        if (!isValid()) {
            return false;
        }

        // Check order amount
        if (minOrderAmount != null && orderAmount < minOrderAmount) {
            return false;
        }

        if (maxOrderAmount != null && orderAmount > maxOrderAmount) {
            return false;
        }

        // Check item count
        if (minItemCount != null && itemCount < minItemCount) {
            return false;
        }

        if (maxItemCount != null && itemCount > maxItemCount) {
            return false;
        }

        // Check user role if specified
        if (eligibleUserRoles != null && !eligibleUserRoles.isEmpty() && userRole != null) {
            String[] roles = eligibleUserRoles.split(",");
            boolean roleMatches = false;
            for (String role : roles) {
                if (role.trim().equalsIgnoreCase(userRole)) {
                    roleMatches = true;
                    break;
                }
            }
            if (!roleMatches) {
                return false;
            }
        }

        return true;
    }

    // Helper method to calculate discount
    public Double calculateDiscount(Double orderAmount) {
        if (!isValid()) {
            return 0.0;
        }

        if (ruleType == DiscountType.PERCENTAGE) {
            return (orderAmount * ruleValue) / 100.0;
        } else if (ruleType == DiscountType.FIXED_AMOUNT) {
            return ruleValue;
        }

        return 0.0;
    }
}
