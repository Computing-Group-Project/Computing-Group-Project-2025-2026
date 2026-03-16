package com.demeter.backend.wallet.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class TopUpRequest {

    @NotNull(message = "User ID is required")
    private Long userId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    public TopUpRequest() {}

    public TopUpRequest(Long userId, BigDecimal amount) {
        this.userId = userId;
        this.amount = amount;
    }

}
