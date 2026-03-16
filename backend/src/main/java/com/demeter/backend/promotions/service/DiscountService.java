package com.demeter.backend.promotions.service;

import com.demeter.backend.promotions.model.Discount;
import com.demeter.backend.promotions.repo.DiscountRepository;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.shared.util.LogActivity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DiscountService {
    private final DiscountRepository discountRepository;

    public DiscountService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    @LogActivity(action = "CREATE_DISCOUNT", targetTable = "DISCOUNT")
    public Discount createDiscount(Discount discount) {
        return discountRepository.save(discount);
    }

    public Optional<Discount> getDiscountById(Integer id) {
        return discountRepository.findById(id);
    }

    public List<Discount> getAllDiscounts() {
        return discountRepository.findAll();
    }

    public List<Discount> getActiveDiscounts() {
        return discountRepository.findByIsActive(true);
    }

    public List<Discount> getDiscountsByCafeteria(Integer cafeteriaId) {
        return discountRepository.findByCafeteriaId(cafeteriaId);
    }

    public List<Discount> getActiveDiscountsByCafeteria(Integer cafeteriaId) {
        return discountRepository.findByCafeteriaIdAndIsActive(cafeteriaId, true);
    }

    public List<Discount> getPendingAIDiscounts() {
        return discountRepository.findByAiGeneratedAndApprovedByIsNull(true);
    }

    public List<Discount> getPendingAIDiscountsByCafeteria(Integer cafeteriaId) {
        return discountRepository.findByCafeteriaIdAndAiGeneratedAndApprovedByIsNull(cafeteriaId, true);
    }

    @LogActivity(action = "APPROVE_DISCOUNT", targetTable = "DISCOUNT")
    public Discount approveDiscount(Integer discountId, Integer staffUserId) {
        return discountRepository.findById(discountId).map(discount -> {
            discount.setApprovedBy(staffUserId);
            discount.setIsActive(true);
            return discountRepository.save(discount);
        }).orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));
    }

    @LogActivity(action = "REJECT_DISCOUNT", targetTable = "DISCOUNT")
    public Discount rejectDiscount(Integer discountId) {
        return discountRepository.findById(discountId).map(discount -> {
            discount.setIsActive(false);
            return discountRepository.save(discount);
        }).orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));
    }

    @LogActivity(action = "UPDATE_DISCOUNT", targetTable = "DISCOUNT")
    public Discount updateDiscount(Integer id, Discount discount) {
        return discountRepository.findById(id).map(existing -> {
            existing.setCafeteriaId(discount.getCafeteriaId());
            existing.setDiscountType(discount.getDiscountType());
            existing.setDiscountValue(discount.getDiscountValue());
            existing.setApplicableItems(discount.getApplicableItems());
            existing.setRequirements(discount.getRequirements());
            existing.setAiGenerated(discount.getAiGenerated());
            existing.setStartDate(discount.getStartDate());
            existing.setEndDate(discount.getEndDate());
            existing.setIsActive(discount.getIsActive());
            return discountRepository.save(existing);
        }).orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));
    }

    @LogActivity(action = "DELETE_DISCOUNT", targetTable = "DISCOUNT")
    public void deleteDiscount(Integer id) {
        discountRepository.deleteById(id);
    }

    @LogActivity(action = "DEACTIVATE_DISCOUNT", targetTable = "DISCOUNT")
    public Discount deactivateDiscount(Integer id) {
        return discountRepository.findById(id).map(discount -> {
            discount.setIsActive(false);
            return discountRepository.save(discount);
        }).orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));
    }
}
