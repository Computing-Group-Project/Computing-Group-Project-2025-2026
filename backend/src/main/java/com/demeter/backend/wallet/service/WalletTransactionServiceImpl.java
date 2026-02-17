package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.model.WalletTransaction;
import com.demeter.backend.wallet.enums.TransactionStatus;
import com.demeter.backend.wallet.enums.TransactionType;
import com.demeter.backend.wallet.repo.WalletTransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WalletTransactionServiceImpl implements WalletTransactionService {

    private final WalletTransactionRepository walletTransactionRepository;

    @Override
    public WalletTransaction createTransaction(
            Long walletId,
            Long amount,
            TransactionType type,
            TransactionStatus status,
            String referenceId,
            String description
    ) {
        WalletTransaction tx = WalletTransaction.builder()
                .walletId(walletId)
                .amount(amount)
                .type(type)
                .status(status)
                .referenceId(referenceId)
                .description(description)
                .createdAt(Instant.now())
                .build();

        return walletTransactionRepository.save(tx);
    }

    @Override
    @Transactional
    public WalletTransaction markSuccess(Long transactionId) {
        WalletTransaction tx = getById(transactionId);
        tx.setStatus(TransactionStatus.SUCCESS);
        tx.setUpdatedAt(Instant.now());
        return walletTransactionRepository.save(tx);
    }

    @Override
    @Transactional
    public void markFailed(Long transactionId, String failureReason) {
        WalletTransaction tx = getById(transactionId);
        tx.setStatus(TransactionStatus.FAILED);
        tx.setFailureReason(failureReason);
        tx.setUpdatedAt(Instant.now());
        walletTransactionRepository.save(tx);
    }

    @Override
    public WalletTransaction getById(Long transactionId) {
        return walletTransactionRepository.findById(transactionId)
                .orElseThrow(() -> new IllegalArgumentException("Transaction not found: " + transactionId));
    }

    @Override
    public List<WalletTransaction> listByWalletId(Long walletId) {
        return walletTransactionRepository
                .findByWalletIdOrderByCreatedAtDesc(walletId);
    }
}
