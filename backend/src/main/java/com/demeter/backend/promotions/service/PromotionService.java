package com.demeter.backend.promotions.service;

import com.demeter.backend.promotions.model.Promotion;
import com.demeter.backend.promotions.repo.PromotionRepository;
import com.demeter.backend.shared.enums.PromotionStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PromotionService {
    private final PromotionRepository promotionRepository;

    public PromotionService(PromotionRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // Create a new promotion
    public Promotion createPromotion(Promotion promotion) {
        if (promotion.getStartDate() == null) {
            promotion.setStartDate(LocalDateTime.now());
        }
        promotion.setCreatedAt(LocalDateTime.now());
        promotion.setUpdatedAt(LocalDateTime.now());
        return promotionRepository.save(promotion);
    }

    // Get a promotion by ID
    public Optional<Promotion> getPromotionById(Long id) {
        return promotionRepository.findById(id);
    }

    // Get all promotions
    public List<Promotion> getAllPromotions() {
        return promotionRepository.findAll();
    }

    // Get active promotions
    public List<Promotion> getActivePromotions() {
        return promotionRepository.findByStatus(PromotionStatus.ACTIVE);
    }

    // Get promotions for a specific cafeteria
    public List<Promotion> getPromotionsByCafeteria(Long cafeteriaId) {
        return promotionRepository.findByCafeteriaId(cafeteriaId);
    }

    // Get active promotions for a specific cafeteria
    public List<Promotion> getActivePromotionsByCafeteria(Long cafeteriaId) {
        return promotionRepository.findByCafeteriaIdAndStatus(cafeteriaId, PromotionStatus.ACTIVE);
    }

    // Update a promotion
    public Promotion updatePromotion(Long id, Promotion promotion) {
        return promotionRepository.findById(id).map(existing -> {
            existing.setName(promotion.getName());
            existing.setDescription(promotion.getDescription());
            existing.setDiscountType(promotion.getDiscountType());
            existing.setDiscountValue(promotion.getDiscountValue());
            existing.setMinOrderAmount(promotion.getMinOrderAmount());
            existing.setMaxUsageCount(promotion.getMaxUsageCount());
            existing.setStatus(promotion.getStatus());
            existing.setStartDate(promotion.getStartDate());
            existing.setEndDate(promotion.getEndDate());
            existing.setCafeteriaId(promotion.getCafeteriaId());
            existing.setUpdatedAt(LocalDateTime.now());
            return promotionRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Promotion not found"));
    }

    // Delete a promotion
    public void deletePromotion(Long id) {
        promotionRepository.deleteById(id);
    }

    // Deactivate a promotion
    public Promotion deactivatePromotion(Long id) {
        return promotionRepository.findById(id).map(promotion -> {
            promotion.setStatus(PromotionStatus.INACTIVE);
            promotion.setUpdatedAt(LocalDateTime.now());
            return promotionRepository.save(promotion);
        }).orElseThrow(() -> new RuntimeException("Promotion not found"));
    }

    // Increment usage count
    public void incrementUsageCount(Long promotionId) {
        promotionRepository.findById(promotionId).ifPresent(promotion -> {
            promotion.setCurrentUsageCount(promotion.getCurrentUsageCount() + 1);
            promotion.setUpdatedAt(LocalDateTime.now());
            promotionRepository.save(promotion);
        });
    }
}
