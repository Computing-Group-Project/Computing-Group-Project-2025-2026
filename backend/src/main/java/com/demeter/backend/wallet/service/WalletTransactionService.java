package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.model.WalletTransaction;
import com.demeter.backend.wallet.enums.TransactionStatus;
import com.demeter.backend.wallet.enums.TransactionType;

import java.util.List;

public interface WalletTransactionService {

    WalletTransaction createTransaction(
            Long walletId,
            Long amount,
            TransactionType type,
            TransactionStatus status,
            String referenceId,
            String description
    );

    WalletTransaction markSuccess(Long transactionId);
    void markFailed(Long transactionId, String failureReason);

    WalletTransaction getById(Long transactionId);
    List<WalletTransaction> listByWalletId(Long walletId);
}
