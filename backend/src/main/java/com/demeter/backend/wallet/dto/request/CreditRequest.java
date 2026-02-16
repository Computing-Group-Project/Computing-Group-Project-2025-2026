package com.demeter.backend.wallet.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreditRequest {
    private Long walletId;
    private Long amount;
    private String referenceId;
    private String description;
}
