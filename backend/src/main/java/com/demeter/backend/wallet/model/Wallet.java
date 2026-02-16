package com.demeter.backend.wallet.model;

import com.demeter.backend.wallet.enums.WalletStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "wallets",
        uniqueConstraints = {
                @UniqueConstraint(name = "uk_wallet_user_id", columnNames = "user_id")
        })
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Wallet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private Long balance;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private WalletStatus status;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;
}
