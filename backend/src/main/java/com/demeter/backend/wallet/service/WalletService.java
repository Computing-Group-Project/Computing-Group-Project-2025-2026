package com.demeter.backend.wallet.service;

import com.demeter.backend.wallet.dto.request.*;
import com.demeter.backend.wallet.dto.response.WalletBalanceResponse;
import com.demeter.backend.wallet.dto.response.WalletResponse;
import com.demeter.backend.wallet.dto.response.WalletTransactionResponse;

import java.util.List;

public interface WalletService {
    WalletResponse createWallet(CreateWalletRequest request);

    WalletResponse getWalletByUserId(Long userId);
    WalletResponse getWalletById(Long walletId);
    WalletBalanceResponse getWalletBalance(Long walletId);

    WalletTransactionResponse credit(CreditRequest request);
    WalletTransactionResponse debit(DebitRequest request);

    WalletTransactionResponse charge(ChargeRequest request);
    WalletTransactionResponse refund(RefundRequest request);

    WalletResponse freezeWallet(Long walletId);
    WalletResponse unfreezeWallet(Long walletId);

    List<WalletTransactionResponse> getWalletTransactions(Long walletId);
    WalletTransactionResponse getTransactionById(Long transactionId);
}
