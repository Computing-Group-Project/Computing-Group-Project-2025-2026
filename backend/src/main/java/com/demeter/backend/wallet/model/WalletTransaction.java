package com.demeter.backend.wallet.model;

import com.demeter.backend.wallet.enums.*;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
        name = "wallet_transactions",
        indexes = {
                @Index(name = "idx_wallet_id", columnList = "wallet_id"),
                @Index(name = "idx_reference_id", columnList = "reference_id"),
                @Index(name = "idx_wallet_created", columnList = "wallet_id, created_at"),
                @Index(name = "idx_category_created", columnList = "category, created_at"),
                @Index(name = "idx_status_created", columnList = "status, created_at")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "wallet_id", nullable = false)
    private Long walletId;

    @Column(nullable = false)
    private Long amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    // NEW
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionCategory category;

    // NEW
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionSource source;

    @Column(name = "reference_id")
    private String referenceId;

    @Column
    private String description;

    @Column(name = "failure_reason")
    private String failureReason;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = (this.createdAt == null) ? Instant.now() : this.createdAt;
        this.updatedAt = Instant.now();

        // safe defaults
        this.category = (this.category == null) ? TransactionCategory.ADJUSTMENT : this.category;
        this.source = (this.source == null) ? TransactionSource.SYSTEM : this.source;
        this.status = (this.status == null) ? TransactionStatus.PENDING : this.status;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
