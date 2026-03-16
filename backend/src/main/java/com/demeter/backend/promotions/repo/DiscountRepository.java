package com.demeter.backend.promotions.repo;

import com.demeter.backend.promotions.model.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscountRepository extends JpaRepository<Discount, Integer> {
    List<Discount> findByCafeteriaId(Integer cafeteriaId);
    List<Discount> findByCafeteriaIdAndIsActive(Integer cafeteriaId, Boolean isActive);
    List<Discount> findByIsActive(Boolean isActive);
    List<Discount> findByAiGeneratedAndApprovedByIsNull(Boolean aiGenerated);
    List<Discount> findByCafeteriaIdAndAiGeneratedAndApprovedByIsNull(Integer cafeteriaId, Boolean aiGenerated);
}
