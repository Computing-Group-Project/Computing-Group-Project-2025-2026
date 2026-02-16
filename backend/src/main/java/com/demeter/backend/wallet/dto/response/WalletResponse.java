package com.demeter.backend.wallet.dto.response;

import com.demeter.backend.wallet.enums.WalletStatus;
import lombok.*;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class WalletResponse {
    private Long id;
    private Long userId;
    private Long balance;
    private WalletStatus status;
    private Instant createdAt;
    private Instant updatedAt;
}
