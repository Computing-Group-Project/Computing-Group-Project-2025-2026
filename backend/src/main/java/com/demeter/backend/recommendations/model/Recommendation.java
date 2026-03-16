package com.demeter.backend.recommendations.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "Recommendation")
public class Recommendation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "recommendation_id")
    private Long recommendationId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "item_id", nullable = false)
    private Long itemId;

    @Column(name = "recommendation_type", length = 50)
    private String recommendationType;

    @Column(name = "confidence_score", precision = 3, scale = 2)
    private BigDecimal confidenceScore;

    @Column(name = "context_data", columnDefinition = "TEXT")
    private String contextData;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "shown_at")
    private LocalDateTime shownAt;

    @Column
    private Boolean clicked = false;

    public Recommendation() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
