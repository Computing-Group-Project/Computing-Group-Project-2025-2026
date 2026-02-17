package com.demeter.backend.wallet.controller;

import com.demeter.backend.wallet.dto.request.PurchaseRequest;
import com.demeter.backend.wallet.enums.TransactionCategory;
import com.demeter.backend.wallet.mapper.WalletExtraMapper;
import com.demeter.backend.wallet.security.CurrentUserIdProvider;
import com.demeter.backend.wallet.service.WalletHistoryService;
import com.demeter.backend.wallet.service.WalletPurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletPurchaseController {

    private final CurrentUserIdProvider currentUserIdProvider;
    private final WalletPurchaseService purchaseService;
    private final WalletHistoryService historyService;
    private final WalletExtraMapper mapper;

    @PostMapping("/purchases")
    public Object purchase(@Valid @RequestBody PurchaseRequest req) {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        return mapper.toTxResponse(purchaseService.purchase(userId, req));
    }

    @GetMapping("/history/purchases")
    public Page<?> purchaseHistory(
            @RequestParam(required = false) Instant from,
            @RequestParam(required = false) Instant to,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Long userId = currentUserIdProvider.getUserIdOrThrow();
        Pageable pageable = PageRequest.of(page, size);

        return historyService.getUserHistory(
                        userId,
                        null,
                        null,
                        TransactionCategory.PURCHASE,
                        from,
                        to,
                        null,
                        null,
                        null,
                        pageable
                )
                .map(mapper::toTxResponse);
    }
}