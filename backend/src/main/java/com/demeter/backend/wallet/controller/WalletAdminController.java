package com.demeter.backend.wallet.controller;

import com.demeter.backend.wallet.enums.*;
import com.demeter.backend.wallet.mapper.WalletExtraMapper;
import com.demeter.backend.wallet.service.WalletHistoryService;
import com.demeter.backend.wallet.service.WalletPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/wallet/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class WalletAdminController {

    private final WalletHistoryService historyService;
    private final WalletPaymentService paymentService;
    private final WalletExtraMapper mapper;

    @GetMapping("/transactions")
    public Page<?> search(
            @RequestParam(required = false) Long walletId,
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(required = false) TransactionCategory category,
            @RequestParam(required = false) TransactionSource source,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(required = false) Long minAmount,
            @RequestParam(required = false) Long maxAmount,
            @RequestParam(required = false) String referenceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return historyService.adminSearch(
                        walletId, type, status, category, source, from, to, minAmount, maxAmount, referenceId, pageable
                )
                .map(mapper::toTxResponse);
    }

    @PostMapping("/payments/{txId}/success")
    public Object markPaymentSuccess(@PathVariable Long txId) {
        return mapper.toTxResponse(paymentService.markPaymentSuccess(txId));
    }

    @PostMapping("/payments/{txId}/failed")
    public Object markPaymentFailed(@PathVariable Long txId, @RequestParam String reason) {
        return mapper.toTxResponse(paymentService.markPaymentFailed(txId, reason));
    }
}