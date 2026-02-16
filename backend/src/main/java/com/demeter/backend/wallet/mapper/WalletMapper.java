package com.demeter.backend.wallet.mapper;

import com.demeter.backend.wallet.dto.response.WalletResponse;
import com.demeter.backend.wallet.model.Wallet;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class WalletMapper {

    private final ModelMapper modelMapper;

    public WalletResponse toResponse(Wallet wallet) {
        return modelMapper.map(wallet, WalletResponse.class);
    }

    public Wallet toEntity(WalletResponse response) {
        return modelMapper.map(response, Wallet.class);
    }
}
