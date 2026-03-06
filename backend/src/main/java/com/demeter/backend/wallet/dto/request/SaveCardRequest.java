package com.demeter.backend.wallet.dto.request;

import com.demeter.backend.wallet.enums.PaymentProvider;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SaveCardRequest {
    @NotNull
    private PaymentProvider provider;

    @NotBlank
    private String providerPaymentMethodId;

    private String brand;
    private String last4;
    private Integer expMonth;
    private Integer expYear;

    private boolean setDefault;
}
