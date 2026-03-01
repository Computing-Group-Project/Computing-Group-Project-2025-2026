package com.demeter.backend.wallet.dto.request;

import com.demeter.backend.wallet.enums.TransactionCategory;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CardChargeRequest {

    private Long savedCardId;

    @NotNull
    @Min(1)
    private Long amount;

    private String referenceId;

    private String description;

    private TransactionCategory category;
}