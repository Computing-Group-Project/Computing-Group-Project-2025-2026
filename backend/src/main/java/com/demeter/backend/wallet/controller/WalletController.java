package com.demeter.backend.wallet.controller;

import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.wallet.dto.request.*;
import com.demeter.backend.wallet.dto.response.WalletBalanceResponse;
import com.demeter.backend.wallet.dto.response.WalletResponse;
import com.demeter.backend.wallet.dto.response.WalletTransactionResponse;
import com.demeter.backend.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<WalletResponse>> createWallet(@RequestBody CreateWalletRequest request) {
        WalletResponse data = walletService.createWallet(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet created successfully", data));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<WalletResponse>> getWalletByUserId(@PathVariable Long userId) {
        WalletResponse data = walletService.getWalletByUserId(userId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet fetched successfully", data));
    }

    @GetMapping("/{walletId}")
    public ResponseEntity<ApiResponse<WalletResponse>> getWalletById(@PathVariable Long walletId) {
        WalletResponse data = walletService.getWalletById(walletId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet fetched successfully", data));
    }

    @GetMapping("/{walletId}/balance")
    public ResponseEntity<ApiResponse<WalletBalanceResponse>> getWalletBalance(@PathVariable Long walletId) {
        WalletBalanceResponse data = walletService.getWalletBalance(walletId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet balance fetched successfully", data));
    }

    @PostMapping("/credit")
    public ResponseEntity<ApiResponse<WalletTransactionResponse>> credit(@RequestBody CreditRequest request) {
        WalletTransactionResponse data = walletService.credit(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet credited successfully", data));
    }

    @PostMapping("/debit")
    public ResponseEntity<ApiResponse<WalletTransactionResponse>> debit(@RequestBody DebitRequest request) {
        WalletTransactionResponse data = walletService.debit(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet debited successfully", data));
    }

    @PostMapping("/charge")
    public ResponseEntity<ApiResponse<WalletTransactionResponse>> charge(@RequestBody ChargeRequest request) {
        WalletTransactionResponse data = walletService.charge(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet charged successfully", data));
    }

    @PostMapping("/refund")
    public ResponseEntity<ApiResponse<WalletTransactionResponse>> refund(@RequestBody RefundRequest request) {
        WalletTransactionResponse data = walletService.refund(request);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet refunded successfully", data));
    }

    @PostMapping("/{walletId}/freeze")
    public ResponseEntity<ApiResponse<WalletResponse>> freeze(@PathVariable Long walletId) {
        WalletResponse data = walletService.freezeWallet(walletId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet frozen successfully", data));
    }

    @PostMapping("/{walletId}/unfreeze")
    public ResponseEntity<ApiResponse<WalletResponse>> unfreeze(@PathVariable Long walletId) {
        WalletResponse data = walletService.unfreezeWallet(walletId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet unfrozen successfully", data));
    }

    @GetMapping("/{walletId}/transactions")
    public ResponseEntity<ApiResponse<List<WalletTransactionResponse>>> getTransactions(@PathVariable Long walletId) {
        List<WalletTransactionResponse> data = walletService.getWalletTransactions(walletId);
        return ResponseEntity.ok(new ApiResponse<>(true, "Wallet transactions fetched successfully", data));
    }
}
