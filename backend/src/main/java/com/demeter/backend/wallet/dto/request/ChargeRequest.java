package com.demeter.backend.wallet.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChargeRequest {
    private Long userId;
    private Long amount;
    private String referenceId;
    private String description;
}
