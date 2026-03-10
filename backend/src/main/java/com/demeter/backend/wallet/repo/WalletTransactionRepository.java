package com.demeter.backend.wallet.repo;

import com.demeter.backend.wallet.enums.*;
import com.demeter.backend.wallet.model.WalletTransaction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);

    Optional<WalletTransaction> findByReferenceId(String referenceId);

    Optional<WalletTransaction> findByReferenceIdAndCategory(
            String referenceId,
            TransactionCategory category
    );

    Page<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId, Pageable pageable);

    @Query("""
        SELECT t FROM WalletTransaction t
        WHERE t.walletId = :walletId
          AND (:type IS NULL OR t.type = :type)
          AND (:status IS NULL OR t.status = :status)
          AND (:category IS NULL OR t.category = :category)
          AND (:from IS NULL OR t.createdAt >= :from)
          AND (:to IS NULL OR t.createdAt <= :to)
          AND (:minAmount IS NULL OR t.amount >= :minAmount)
          AND (:maxAmount IS NULL OR t.amount <= :maxAmount)
          AND (:referenceId IS NULL OR t.referenceId = :referenceId)
        ORDER BY t.createdAt DESC
    """)
    Page<WalletTransaction> findWalletHistory(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("category") TransactionCategory category,
            @Param("from") Instant from,
            @Param("to") Instant to,
            @Param("minAmount") Long minAmount,
            @Param("maxAmount") Long maxAmount,
            @Param("referenceId") String referenceId,
            Pageable pageable
    );

    @Query("""
        SELECT t FROM WalletTransaction t
        WHERE t.walletId = :walletId
          AND (
                t.category = com.demeter.backend.wallet.enums.TransactionCategory.MICRO
                OR (
                    :threshold IS NOT NULL
                    AND :threshold > 0
                    AND t.category = com.demeter.backend.wallet.enums.TransactionCategory.PURCHASE
                    AND t.amount <= :threshold
                )
              )
          AND (:type IS NULL OR t.type = :type)
          AND (:status IS NULL OR t.status = :status)
          AND (:from IS NULL OR t.createdAt >= :from)
          AND (:to IS NULL OR t.createdAt <= :to)
          AND (:minAmount IS NULL OR t.amount >= :minAmount)
          AND (:maxAmount IS NULL OR t.amount <= :maxAmount)
          AND (:referenceId IS NULL OR t.referenceId = :referenceId)
        ORDER BY t.createdAt DESC
    """)
    Page<WalletTransaction> findMicroHistory(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("from") Instant from,
            @Param("to") Instant to,
            @Param("minAmount") Long minAmount,
            @Param("maxAmount") Long maxAmount,
            @Param("referenceId") String referenceId,
            @Param("threshold") Long threshold,
            Pageable pageable
    );

    @Query("""
        SELECT t FROM WalletTransaction t
        WHERE (:walletId IS NULL OR t.walletId = :walletId)
          AND (:type IS NULL OR t.type = :type)
          AND (:status IS NULL OR t.status = :status)
          AND (:category IS NULL OR t.category = :category)
          AND (:source IS NULL OR t.source = :source)
          AND (:from IS NULL OR t.createdAt >= :from)
          AND (:to IS NULL OR t.createdAt <= :to)
          AND (:minAmount IS NULL OR t.amount >= :minAmount)
          AND (:maxAmount IS NULL OR t.amount <= :maxAmount)
          AND (:referenceId IS NULL OR t.referenceId = :referenceId)
        ORDER BY t.createdAt DESC
    """)
    Page<WalletTransaction> adminSearch(
            @Param("walletId") Long walletId,
            @Param("type") TransactionType type,
            @Param("status") TransactionStatus status,
            @Param("category") TransactionCategory category,
            @Param("source") TransactionSource source,
            @Param("from") Instant from,
            @Param("to") Instant to,
            @Param("minAmount") Long minAmount,
            @Param("maxAmount") Long maxAmount,
            @Param("referenceId") String referenceId,
            Pageable pageable
    );
}