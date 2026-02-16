package com.demeter.backend.wallet.dto.response;

import com.demeter.backend.wallet.enums.WalletStatus;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WalletBalanceResponse {
    private Long walletId;
    private Long userId;
    private Long balance;
    private WalletStatus status;
}
