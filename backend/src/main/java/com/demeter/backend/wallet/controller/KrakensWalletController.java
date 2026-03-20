package com.demeter.backend.wallet.controller;

import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.transactions.model.TransactionHistory;
import com.demeter.backend.wallet.dto.PendingTopUp;
import com.demeter.backend.wallet.dto.request.StudentTopUpRequest;
import com.demeter.backend.wallet.dto.request.TopUpRequest;
import com.demeter.backend.wallet.dto.response.BalanceResponse;
import com.demeter.backend.wallet.dto.response.TransactionResponse;
import com.demeter.backend.wallet.service.KrakensWalletService;
import com.demeter.backend.wallet.service.TopUpRequestService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class KrakensWalletController {

    private final KrakensWalletService walletService;
    private final TopUpRequestService topUpRequestService;
    private final JwtUtil jwtUtil;

    public KrakensWalletController(KrakensWalletService walletService,
                                   TopUpRequestService topUpRequestService,
                                   JwtUtil jwtUtil) {
        this.walletService = walletService;
        this.topUpRequestService = topUpRequestService;
        this.jwtUtil = jwtUtil;
    }

    @GetMapping("/balance")
    public ApiResponse<BalanceResponse> getBalance(HttpServletRequest request) {
        Long userId = extractUserId(request);
        BigDecimal balance = walletService.getBalance(userId);
        return new ApiResponse<>(true, "Balance retrieved", new BalanceResponse(userId, balance));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/topup")
    public ApiResponse<BalanceResponse> topUp(@Valid @RequestBody TopUpRequest topUpRequest) {
        BigDecimal newBalance = walletService.credit(
                topUpRequest.getUserId(),
                topUpRequest.getAmount(),
                "Admin wallet top-up",
                null
        );
        return new ApiResponse<>(true, "Top-up successful",
                new BalanceResponse(topUpRequest.getUserId(), newBalance));
    }

    @PreAuthorize("hasRole('STUDENT')")
    @PostMapping("/student-topup")
    public ApiResponse<PendingTopUp> studentTopUp(
            @Valid @RequestBody StudentTopUpRequest request,
            HttpServletRequest httpRequest) {
        Long userId = extractUserId(httpRequest);
        String username = extractUsername(httpRequest);
        PendingTopUp pending = topUpRequestService.createRequest(userId, username, request.getAmount());
        return new ApiResponse<>(true, "Top-up request submitted for approval", pending);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/topup-requests")
    public ApiResponse<List<PendingTopUp>> getPendingTopUpRequests() {
        return new ApiResponse<>(true, "Pending top-up requests retrieved",
                topUpRequestService.getPendingRequests());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/topup-requests/{id}/approve")
    public ApiResponse<PendingTopUp> approveTopUpRequest(@PathVariable int id) {
        PendingTopUp approved = topUpRequestService.approveRequest(id);
        return new ApiResponse<>(true, "Top-up request approved", approved);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/topup-requests/{id}/reject")
    public ApiResponse<PendingTopUp> rejectTopUpRequest(@PathVariable int id) {
        PendingTopUp rejected = topUpRequestService.rejectRequest(id);
        return new ApiResponse<>(true, "Top-up request rejected", rejected);
    }

    @GetMapping("/transactions")
    public ApiResponse<List<TransactionResponse>> getTransactions(HttpServletRequest request) {
        Long userId = extractUserId(request);
        List<TransactionHistory> history = walletService.getTransactionHistory(userId);
        List<TransactionResponse> responses = history.stream()
                .map(tx -> new TransactionResponse(
                        tx.getTransactionId(),
                        tx.getTransactionType(),
                        tx.getAmount(),
                        tx.getBalanceBefore(),
                        tx.getBalanceAfter(),
                        tx.getDescription(),
                        tx.getReferenceId(),
                        tx.getCreatedAt()
                ))
                .toList();
        return new ApiResponse<>(true, "Transactions retrieved", responses);
    }

    private Long extractUserId(HttpServletRequest request) {
        String token = extractToken(request);
        return jwtUtil.extractUserId(token);
    }

    private String extractUsername(HttpServletRequest request) {
        String token = extractToken(request);
        return jwtUtil.extractUsername(token);
    }

    private String extractToken(HttpServletRequest request) {
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            return header.substring(7);
        }
        throw new AppException(ErrorCode.UNAUTHORIZED_ACCESS);
    }
}
