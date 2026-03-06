package com.demeter.backend.wallet.dto.response;

import com.demeter.backend.wallet.enums.*;
import lombok.*;

import java.time.Instant;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class WalletTransactionResponse {
    private Long id;
    private Long walletId;
    private Long amount;
    private TransactionType type;
    private TransactionStatus status;
    private TransactionCategory category;
    private TransactionSource source;
    private String referenceId;
    private String description;
    private String failureReason;
    private Instant createdAt;
}
