package com.demeter.backend.promotions.repo;

import com.demeter.backend.promotions.model.PromoCode;
import com.demeter.backend.shared.enums.PromotionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromoCodeRepository extends JpaRepository<PromoCode, Long> {
    Optional<PromoCode> findByCode(String code);
    List<PromoCode> findByStatus(PromotionStatus status);
    List<PromoCode> findByPromotion_PromotionId(Long promotionId);
}
