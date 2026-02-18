package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.dto.request.PurchaseRequest;
import com.demeter.backend.wallet.enums.*;
import com.demeter.backend.wallet.model.Wallet;
import com.demeter.backend.wallet.model.WalletTransaction;
import com.demeter.backend.wallet.repo.WalletRepository;
import com.demeter.backend.wallet.repo.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class WalletPurchaseService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository txRepository;

    @Transactional
    public WalletTransaction purchase(Long userId, PurchaseRequest req) {

        // idempotency guard (prevents double-debit for same orderId)
        var existing = txRepository.findByReferenceIdAndCategory(req.getReferenceId(), TransactionCategory.PURCHASE);
        if (existing.isPresent()) {
            return existing.get();
        }

        Wallet wallet = walletRepository.findByUserIdForUpdate(userId)
                .orElseThrow(() -> new IllegalArgumentException("Wallet not found"));

        if (wallet.getStatus() != WalletStatus.ACTIVE) {
            throw new IllegalStateException("Wallet is not active");
        }

        long amount = req.getAmount();

        if (wallet.getBalance() < amount) {
            WalletTransaction failedTx = WalletTransaction.builder()
                    .walletId(wallet.getId())
                    .amount(amount)
                    .type(TransactionType.DEBIT)
                    .status(TransactionStatus.FAILED)
                    .category(TransactionCategory.PURCHASE)
                    .source(TransactionSource.USER)
                    .referenceId(req.getReferenceId())
                    .description(req.getDescription())
                    .failureReason("Insufficient balance")
                    .createdAt(Instant.now())
                    .updatedAt(Instant.now())
                    .build();

            return txRepository.save(failedTx);
        }

        // create PENDING transaction first
        WalletTransaction tx = WalletTransaction.builder()
                .walletId(wallet.getId())
                .amount(amount)
                .type(TransactionType.DEBIT)
                .status(TransactionStatus.PENDING)
                .category(TransactionCategory.PURCHASE)
                .source(TransactionSource.USER)
                .referenceId(req.getReferenceId())
                .description(req.getDescription())
                .failureReason(null)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();

        tx = txRepository.save(tx);

        wallet.setBalance(wallet.getBalance() - amount);
        walletRepository.save(wallet);

        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setUpdatedAt(Instant.now());
        return txRepository.save(tx);
    }
}