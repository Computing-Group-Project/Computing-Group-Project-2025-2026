// com/demeter/backend/wallet/dto/request/CreateWalletRequest.java
package com.demeter.backend.wallet.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateWalletRequest {
    private Long userId;
    private Long initialBalance; // nullable => default 0
}
