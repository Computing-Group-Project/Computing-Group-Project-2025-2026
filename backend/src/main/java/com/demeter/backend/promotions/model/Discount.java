package com.demeter.backend.promotions.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "Discount")
public class Discount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "discount_id")
    private Integer discountId;

    @Column(name = "cafeteria_id", nullable = false)
    private Integer cafeteriaId;

    @Column(name = "discount_type", length = 50)
    private String discountType;

    @Column(name = "discount_value", precision = 10, scale = 2)
    private BigDecimal discountValue;

    @Column(name = "applicable_items", columnDefinition = "TEXT")
    private String applicableItems;

    @Column(name = "requirements", columnDefinition = "TEXT")
    private String requirements;

    @Column(name = "ai_generated")
    private Boolean aiGenerated = false;

    @Column(name = "approved_by")
    private Integer approvedBy;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public Discount() {}

    public Discount(Integer cafeteriaId, String discountType, BigDecimal discountValue,
                    String applicableItems, String requirements) {
        this.cafeteriaId = cafeteriaId;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.applicableItems = applicableItems;
        this.requirements = requirements;
    }

    public boolean isApproved() {
        return approvedBy != null;
    }

    public boolean isValid() {
        if (!Boolean.TRUE.equals(isActive)) {
            return false;
        }

        LocalDate today = LocalDate.now();

        if (startDate != null && today.isBefore(startDate)) {
            return false;
        }

        if (endDate != null && today.isAfter(endDate)) {
            return false;
        }

        return true;
    }
}
