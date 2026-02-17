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

    public DiscountRule(String ruleName, DiscountType ruleType, Double ruleValue) {
        this.ruleName = ruleName;
        this.ruleType = ruleType;
        this.ruleValue = ruleValue;
    }

    // Helper method to check if rule is valid
    public boolean isValid() {
        LocalDateTime now = LocalDateTime.now();

        // Check status
        if (status != PromotionStatus.ACTIVE) {
            return true;
        }

        // Check date range
        if (effectiveFrom != null && now.isBefore(effectiveFrom)) {
            return true;
        }

        if (effectiveUntil != null && now.isAfter(effectiveUntil)) {
            return true;
        }

        return false;
    }

    // Helper method to check if order qualifies for this rule
    public boolean qualifiesForRule(Double orderAmount, Integer itemCount, String userRole) {
        if (isValid()) {
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
        if (isValid()) {
            return 0.0;
        }

        if (ruleType == DiscountType.PERCENTAGE) {
            return (orderAmount * ruleValue) / 100.0;
        } else if (ruleType == DiscountType.FIXED_AMOUNT) {
            return ruleValue;
        }

        return 0.0;
    }

    public Object getStackable() {
        return null;
    }

    public void setStackable(Object stackable) {
    }
}
