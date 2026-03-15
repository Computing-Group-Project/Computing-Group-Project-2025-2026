package com.demeter.backend.wallet.dto.request;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class StudentTopUpRequest {

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    @DecimalMax(value = "500", message = "Maximum top-up amount is 500 GK")
    private BigDecimal amount;

    public StudentTopUpRequest() {}

    public StudentTopUpRequest(BigDecimal amount) {
        this.amount = amount;
    }

}
