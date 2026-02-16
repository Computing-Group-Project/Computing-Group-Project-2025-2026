// com/demeter/backend/wallet/repository/WalletTransactionRepository.java
package com.demeter.backend.wallet.repo;

import com.demeter.backend.wallet.entity.WalletTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WalletTransactionRepository extends JpaRepository<WalletTransaction, Long> {

    List<WalletTransaction> findByWalletIdOrderByCreatedAtDesc(Long walletId);

    Optional<WalletTransaction> findByReferenceId(String referenceId);
}
