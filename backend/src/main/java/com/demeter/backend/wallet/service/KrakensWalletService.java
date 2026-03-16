package com.demeter.backend.wallet.service;

import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.shared.util.LogActivity;
import com.demeter.backend.transactions.model.TransactionHistory;
import com.demeter.backend.transactions.repo.TransactionHistoryRepository;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Service
public class KrakensWalletService {

    private final UserRepository userRepository;
    private final TransactionHistoryRepository transactionHistoryRepository;

    public KrakensWalletService(UserRepository userRepository,
                                TransactionHistoryRepository transactionHistoryRepository) {
        this.userRepository = userRepository;
        this.transactionHistoryRepository = transactionHistoryRepository;
    }

    public BigDecimal getBalance(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return user.getKrakensBalance();
    }

    @LogActivity(action = "WALLET_DEBIT", targetTable = "TRANSACTION_HISTORY")
    @Transactional
    public BigDecimal debit(Long userId, BigDecimal amount, String description, Integer referenceId) {
        User user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (user.getKrakensBalance().compareTo(amount) < 0) {
            throw new AppException(ErrorCode.INSUFFICIENT_BALANCE);
        }

        BigDecimal balanceBefore = user.getKrakensBalance();
        user.setKrakensBalance(balanceBefore.subtract(amount));
        userRepository.save(user);

        TransactionHistory tx = new TransactionHistory();
        tx.setUserId(userId);
        tx.setTransactionType("DEBIT");
        tx.setAmount(amount);
        tx.setBalanceBefore(balanceBefore);
        tx.setBalanceAfter(user.getKrakensBalance());
        tx.setReferenceId(referenceId);
        tx.setDescription(description);
        transactionHistoryRepository.save(tx);

        return user.getKrakensBalance();
    }

    @LogActivity(action = "WALLET_CREDIT", targetTable = "TRANSACTION_HISTORY")
    @Transactional
    public BigDecimal credit(Long userId, BigDecimal amount, String description, Integer referenceId) {
        User user = userRepository.findByIdForUpdate(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        BigDecimal balanceBefore = user.getKrakensBalance();
        user.setKrakensBalance(balanceBefore.add(amount));
        userRepository.save(user);

        TransactionHistory tx = new TransactionHistory();
        tx.setUserId(userId);
        tx.setTransactionType("CREDIT");
        tx.setAmount(amount);
        tx.setBalanceBefore(balanceBefore);
        tx.setBalanceAfter(user.getKrakensBalance());
        tx.setReferenceId(referenceId);
        tx.setDescription(description);
        transactionHistoryRepository.save(tx);

        return user.getKrakensBalance();
    }

    public List<TransactionHistory> getTransactionHistory(Long userId) {
        userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return transactionHistoryRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
}
