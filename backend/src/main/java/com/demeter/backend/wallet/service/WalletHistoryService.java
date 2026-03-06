package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.enums.*;
import com.demeter.backend.wallet.model.Wallet;
import com.demeter.backend.wallet.model.WalletTransaction;
import com.demeter.backend.wallet.repo.WalletRepository;
import com.demeter.backend.wallet.repo.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class WalletHistoryService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository txRepository;

    @Value("${wallet.micro.max-amount:0}")
    private long microMaxAmount;

    public Page<WalletTransaction> getUserHistory(
            Long userId,
            TransactionType type,
            TransactionStatus status,
            TransactionCategory category,
            Instant from,
            Instant to,
            Long minAmount,
            Long maxAmount,
            String referenceId,
            Pageable pageable
    ) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        return txRepository.findWalletHistory(
                wallet.getId(),
                type,
                status,
                category,
                from,
                to,
                minAmount,
                maxAmount,
                referenceId,
                pageable
        );
    }

    public Page<WalletTransaction> getUserMicroHistory(
            Long userId,
            TransactionType type,
            TransactionStatus status,
            Instant from,
            Instant to,
            Long minAmount,
            Long maxAmount,
            String referenceId,
            Pageable pageable
    ) {
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        Long threshold = (microMaxAmount > 0) ? microMaxAmount : 0L;

        return txRepository.findMicroHistory(
                wallet.getId(),
                type,
                status,
                from,
                to,
                minAmount,
                maxAmount,
                referenceId,
                threshold,
                pageable
        );
    }

    public Page<WalletTransaction> adminSearch(
            Long walletId,
            TransactionType type,
            TransactionStatus status,
            TransactionCategory category,
            TransactionSource source,
            Instant from,
            Instant to,
            Long minAmount,
            Long maxAmount,
            String referenceId,
            Pageable pageable
    ) {
        return txRepository.adminSearch(
                walletId,
                type,
                status,
                category,
                source,
                from,
                to,
                minAmount,
                maxAmount,
                referenceId,
                pageable
        );
    }
}