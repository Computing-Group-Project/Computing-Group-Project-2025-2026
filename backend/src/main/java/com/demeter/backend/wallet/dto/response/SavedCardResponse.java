package com.demeter.backend.wallet.dto.response;

import com.demeter.backend.wallet.enums.*;
import lombok.*;

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class SavedCardResponse {
    private Long id;
    private PaymentProvider provider;
    private String brand;
    private String last4;
    private Integer expMonth;
    private Integer expYear;
    private boolean isDefault;
    private SavedCardStatus status;
}
