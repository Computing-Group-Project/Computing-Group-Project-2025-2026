package com.demeter.backend.wallet.model;

import com.demeter.backend.wallet.enums.TransactionStatus;
import com.demeter.backend.wallet.enums.TransactionType;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "wallet_transactions",
        indexes = {
                @Index(name = "idx_wallet_id", columnList = "wallet_id"),
                @Index(name = "idx_reference_id", columnList = "reference_id")
        })
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
}
