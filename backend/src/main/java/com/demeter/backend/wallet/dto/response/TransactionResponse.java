package com.demeter.backend.wallet.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
public class TransactionResponse {
    private Long transactionId;
    private String type;
    private BigDecimal amount;
    private BigDecimal balanceBefore;
    private BigDecimal balanceAfter;
    private String description;
    private Integer referenceId;
    private LocalDateTime createdAt;

    public TransactionResponse() {}

    public TransactionResponse(Long transactionId, String type, BigDecimal amount,
                               BigDecimal balanceBefore, BigDecimal balanceAfter,
                               String description, Integer referenceId, LocalDateTime createdAt) {
        this.transactionId = transactionId;
        this.type = type;
        this.amount = amount;
        this.balanceBefore = balanceBefore;
        this.balanceAfter = balanceAfter;
        this.description = description;
        this.referenceId = referenceId;
        this.createdAt = createdAt;
    }

}
