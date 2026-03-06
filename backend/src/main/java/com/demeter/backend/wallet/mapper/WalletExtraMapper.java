package com.demeter.backend.wallet.mapper;

import com.demeter.backend.wallet.dto.response.*;
import com.demeter.backend.wallet.model.*;
import org.springframework.stereotype.Component;

@Component
public class WalletExtraMapper {

    public WalletTransactionResponse toTxResponse(WalletTransaction t) {
        return WalletTransactionResponse.builder()
                .id(t.getId())
                .walletId(t.getWalletId())
                .amount(t.getAmount())
                .type(t.getType())
                .status(t.getStatus())
                .category(t.getCategory())
                .source(t.getSource())
                .referenceId(t.getReferenceId())
                .description(t.getDescription())
                .failureReason(t.getFailureReason())
                .createdAt(t.getCreatedAt())
                .build();
    }

    public SavedCardResponse toCardResponse(SavedCard c) {
        return SavedCardResponse.builder()
                .id(c.getId())
                .provider(c.getProvider())
                .brand(c.getBrand())
                .last4(c.getLast4())
                .expMonth(c.getExpMonth())
                .expYear(c.getExpYear())
                .isDefault(c.isDefault())
                .status(c.getStatus())
                .build();
    }
}
