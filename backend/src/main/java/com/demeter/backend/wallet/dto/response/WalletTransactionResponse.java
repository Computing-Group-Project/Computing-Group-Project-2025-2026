package com.demeter.backend.wallet.dto.response;

import com.demeter.backend.wallet.enums.TransactionStatus;
import com.demeter.backend.wallet.enums.TransactionType;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WalletTransactionResponse {
    private Long id;
    private Long walletId;
    private Long amount;
    private TransactionType type;
    private TransactionStatus status;
    private String referenceId;
    private String description;
    private String failureReason;
    private Instant createdAt;
    private Instant updatedAt;
}
