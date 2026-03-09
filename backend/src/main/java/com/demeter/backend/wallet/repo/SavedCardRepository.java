package com.demeter.backend.wallet.repo;

import com.demeter.backend.wallet.enums.SavedCardStatus;
import com.demeter.backend.wallet.model.SavedCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedCardRepository extends JpaRepository<SavedCard, Long> {

    List<SavedCard> findByUserIdOrderByIsDefaultDescIdDesc(Long userId);

    Optional<SavedCard> findByIdAndUserId(Long id, Long userId);

    Optional<SavedCard> findFirstByUserIdAndIsDefaultTrueAndStatus(Long userId, SavedCardStatus status);

    Optional<SavedCard> findFirstByUserIdAndStatusOrderByIdDesc(Long userId, SavedCardStatus status);

    List<SavedCard> findByUserIdAndIsDefaultTrue(Long userId);
}