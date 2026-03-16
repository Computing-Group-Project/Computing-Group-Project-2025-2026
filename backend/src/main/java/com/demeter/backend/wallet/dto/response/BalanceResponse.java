package com.demeter.backend.wallet.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class BalanceResponse {
    private Long userId;
    private BigDecimal balance;

    public BalanceResponse() {}

    public BalanceResponse(Long userId, BigDecimal balance) {
        this.userId = userId;
        this.balance = balance;
    }

}
