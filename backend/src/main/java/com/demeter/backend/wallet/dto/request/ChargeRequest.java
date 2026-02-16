// com/demeter/backend/wallet/dto/request/ChargeRequest.java
package com.demeter.backend.wallet.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChargeRequest {
    private Long userId;
    private Long amount;
    private String referenceId;   // e.g., orderId
    private String description;
}
