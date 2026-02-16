package com.demeter.backend.wallet.controller;

import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.wallet.dto.response.WalletTransactionResponse;
import com.demeter.backend.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet/transactions")
@RequiredArgsConstructor
public class WalletTransactionController {

    private final WalletService walletService;

    @GetMapping("/{transactionId}")
    public ResponseEntity<ApiResponse<WalletTransactionResponse>> getTransactionById(@PathVariable Long transactionId) {
        WalletTransactionResponse data = walletService.getTransactionById(transactionId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Transaction fetched successfully", data));
    }
}
