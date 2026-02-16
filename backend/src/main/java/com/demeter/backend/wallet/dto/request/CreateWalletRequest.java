package com.demeter.backend.wallet.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CreateWalletRequest {
    private Long userId;
    private Long initialBalance;
}
