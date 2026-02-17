package com.demeter.backend.promotions.repo;

import com.demeter.backend.promotions.model.Promotion;
import com.demeter.backend.shared.enums.PromotionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Long> {
    List<Promotion> findByStatus(PromotionStatus status);
    List<Promotion> findByCafeteriaId(Long cafeteriaId);
    List<Promotion> findByCafeteriaIdAndStatus(Long cafeteriaId, PromotionStatus status);
}
