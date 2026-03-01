package com.demeter.backend.wallet.controller;

import com.demeter.backend.wallet.dto.request.CardChargeRequest;
import com.demeter.backend.wallet.mapper.WalletExtraMapper;
import com.demeter.backend.wallet.security.CurrentUserIdProvider;
import com.demeter.backend.wallet.service.WalletPaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet/payments")
@RequiredArgsConstructor
public class WalletPaymentsController {

    private final CurrentUserIdProvider currentUserIdProvider;
    private final WalletPaymentService walletPaymentService;
    private final WalletExtraMapper mapper;

    @PostMapping("/charge")
    public Object charge(@Valid @RequestBody CardChargeRequest req) {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        var tx = walletPaymentService.createCardCharge(userId, req);
        return mapper.toTxResponse(tx);
    }
}