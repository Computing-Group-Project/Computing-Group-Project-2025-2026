package com.demeter.backend.promotions.service;

import com.demeter.backend.promotions.model.PromoCode;
import com.demeter.backend.promotions.repo.PromoCodeRepository;
import com.demeter.backend.shared.enums.PromotionStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PromoCodeService {
    private final PromoCodeRepository promoCodeRepository;
    private final PromotionService promotionService;

    public PromoCodeService(PromoCodeRepository promoCodeRepository, PromotionService promotionService) {
        this.promoCodeRepository = promoCodeRepository;
        this.promotionService = promotionService;
    }

    // Create a new promo code
    public PromoCode createPromoCode(PromoCode promoCode) {
        promoCode.setCreatedAt(LocalDateTime.now());
        promoCode.setUpdatedAt(LocalDateTime.now());
        return promoCodeRepository.save(promoCode);
    }

    // Get promo code by code string
    public Optional<PromoCode> getPromoCodeByCode(String code) {
        return promoCodeRepository.findByCode(code);
    }

    // Validate promo code
    public boolean validatePromoCode(String code) {
        Optional<PromoCode> promoCode = getPromoCodeByCode(code);
        return promoCode.isPresent() && promoCode.get().isValid();
    }

    // Get promo code by ID
    public Optional<PromoCode> getPromoCodeById(Long id) {
        return promoCodeRepository.findById(id);
    }

    // Get all promo codes
    public List<PromoCode> getAllPromoCodes() {
        return promoCodeRepository.findAll();
    }

    // Get active promo codes
    public List<PromoCode> getActivePromoCodes() {
        return promoCodeRepository.findByStatus(PromotionStatus.ACTIVE);
    }

    // Get promo codes for a promotion
    public List<PromoCode> getPromoCodesByPromotion(Long promotionId) {
        return promoCodeRepository.findByPromotion_PromotionId(promotionId);
    }

    // Update a promo code
    public PromoCode updatePromoCode(Long id, PromoCode promoCode) {
        return promoCodeRepository.findById(id).map(existing -> {
            existing.setCode(promoCode.getCode());
            existing.setDescription(promoCode.getDescription());
            existing.setStatus(promoCode.getStatus());
            existing.setMaxUsageCount(promoCode.getMaxUsageCount());
            existing.setValidFrom(promoCode.getValidFrom());
            existing.setValidUntil(promoCode.getValidUntil());
            existing.setUpdatedAt(LocalDateTime.now());
            return promoCodeRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("PromoCode not found"));
    }

    // Delete a promo code
    public void deletePromoCode(Long id) {
        promoCodeRepository.deleteById(id);
    }

    // Apply promo code and get discount
    public Double applyPromoCode(String code, Double orderAmount) {
        Optional<PromoCode> promoCode = getPromoCodeByCode(code);
        
        if (promoCode.isEmpty() || !promoCode.get().isValid()) {
            return 0.0;
        }

        PromoCode pc = promoCode.get();
        Double discount = pc.getDiscount(orderAmount);

        if (discount > 0) {
            // Increment usage count
            pc.setCurrentUsageCount(pc.getCurrentUsageCount() + 1);
            pc.setUpdatedAt(LocalDateTime.now());
            promoCodeRepository.save(pc);

            // Increment promotion usage
            if (pc.getPromotion() != null) {
                promotionService.incrementUsageCount(pc.getPromotion().getPromotionId());
            }
        }

        return discount;
    }

    // Deactivate a promo code
    public PromoCode deactivatePromoCode(Long id) {
        return promoCodeRepository.findById(id).map(promoCode -> {
            promoCode.setStatus(PromotionStatus.INACTIVE);
            promoCode.setUpdatedAt(LocalDateTime.now());
            return promoCodeRepository.save(promoCode);
        }).orElseThrow(() -> new RuntimeException("PromoCode not found"));
    }
}
