package com.demeter.backend.wallet.dto.request;

import com.demeter.backend.wallet.enums.TransactionCategory;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class CardChargeRequest {

    @NotNull
    private Long savedCardId;

    @NotNull @Min(1)
    private Long amount;

    // For linking order/purchase
    private String referenceId;
    private String description;

    // default TOPUP (card -> wallet credit)
    private TransactionCategory category;
}
