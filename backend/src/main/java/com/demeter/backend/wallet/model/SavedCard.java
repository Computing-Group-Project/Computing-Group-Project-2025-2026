package com.demeter.backend.wallet.model;

import com.demeter.backend.wallet.enums.PaymentProvider;
import com.demeter.backend.wallet.enums.SavedCardStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(
        name = "saved_cards",
        indexes = {
                @Index(name = "idx_saved_cards_user", columnList = "user_id"),
                @Index(name = "idx_saved_cards_provider_pm", columnList = "provider, provider_payment_method_id")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SavedCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private PaymentProvider provider;

    @Column(name="provider_payment_method_id", nullable=false, length=128)
    private String providerPaymentMethodId;

    @Column(length=32)
    private String brand;

    @Column(length=4)
    private String last4;

    private Integer expMonth;
    private Integer expYear;

    @Column(name="is_default", nullable=false)
    private boolean isDefault;

    @Enumerated(EnumType.STRING)
    @Column(nullable=false)
    private SavedCardStatus status;

    @Column(name="created_at", nullable=false, updatable=false)
    private Instant createdAt;

    @Column(name="updated_at")
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = (this.createdAt == null) ? Instant.now() : this.createdAt;
        this.updatedAt = Instant.now();
        this.status = (this.status == null) ? SavedCardStatus.ACTIVE : this.status;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
