package com.demeter.backend.transactions.repo;

import com.demeter.backend.transactions.model.TransactionHistory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionHistoryRepository extends JpaRepository<TransactionHistory, Long> {
    List<TransactionHistory> findByUserId(Long userId);
    List<TransactionHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<TransactionHistory> findByReferenceIdAndTransactionType(Integer referenceId, String transactionType);
}
