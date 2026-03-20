package com.demeter.backend.wallet.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PendingTopUp {

    private int requestId;
    private Long userId;
    private String username;
    private BigDecimal amount;
    private LocalDateTime requestedAt;

    public PendingTopUp() {}

    public PendingTopUp(int requestId, Long userId, String username, BigDecimal amount) {
        this.requestId = requestId;
        this.userId = userId;
        this.username = username;
        this.amount = amount;
        this.requestedAt = LocalDateTime.now();
    }
}
