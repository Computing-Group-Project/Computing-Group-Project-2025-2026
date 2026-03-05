package com.demeter.backend.promotions.repo;

import com.demeter.backend.promotions.model.DiscountRule;
import com.demeter.backend.shared.enums.PromotionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DiscountRuleRepository extends JpaRepository<DiscountRule, Long> {
    List<DiscountRule> findByStatus(PromotionStatus status);
    List<DiscountRule> findByPromotion_PromotionId(Long promotionId);
    List<DiscountRule> findByStatusAndEffectiveFromBeforeAndEffectiveUntilAfter(
            PromotionStatus status, LocalDateTime from, LocalDateTime until);
}
