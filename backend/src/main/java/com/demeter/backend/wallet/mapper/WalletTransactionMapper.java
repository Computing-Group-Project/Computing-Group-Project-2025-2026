package com.demeter.backend.wallet.mapper;

import com.demeter.backend.wallet.dto.response.WalletTransactionResponse;
import com.demeter.backend.wallet.model.WalletTransaction;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WalletTransactionMapper {

    private final ModelMapper modelMapper;

    public WalletTransactionResponse toResponse(WalletTransaction transaction) {
        return modelMapper.map(transaction, WalletTransactionResponse.class);
    }

    public WalletTransaction toEntity(WalletTransactionResponse response) {
        return modelMapper.map(response, WalletTransaction.class);
    }
}
