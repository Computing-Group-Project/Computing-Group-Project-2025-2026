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

    // optional display fields
    private String brand;
    private String last4;
    private Integer expMonth;
    private Integer expYear;

    // optional: if true, set as default
    private boolean setDefault;
}
