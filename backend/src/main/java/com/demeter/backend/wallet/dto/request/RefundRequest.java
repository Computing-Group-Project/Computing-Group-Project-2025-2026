package com.demeter.backend.wallet.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequest {
    private Long userId;
    private Long amount;
    private String referenceId;
    private String description;
}
