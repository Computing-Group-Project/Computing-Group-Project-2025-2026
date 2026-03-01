package com.demeter.backend.wallet.controller;

import com.demeter.backend.wallet.enums.*;
import com.demeter.backend.wallet.mapper.WalletExtraMapper;
import com.demeter.backend.wallet.security.CurrentUserIdProvider;
import com.demeter.backend.wallet.service.WalletHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletHistoryController {

    private final CurrentUserIdProvider currentUserIdProvider;
    private final WalletHistoryService historyService;
    private final WalletExtraMapper mapper;

    @GetMapping("/transactions")
    public Page<?> myTransactions(
            @RequestParam(required = false) TransactionType type,
            @RequestParam(required = false) TransactionStatus status,
            @RequestParam(required = false) TransactionCategory category,
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(required = false) Long minAmount,
            @RequestParam(required = false) Long maxAmount,
            @RequestParam(required = false) String referenceId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        Pageable pageable = PageRequest.of(page, size);

        return historyService.getUserHistory(
                        userId, type, status, category, from, to, minAmount, maxAmount, referenceId, pageable
                )
                .map(mapper::toTxResponse);
    }
}