package com.demeter.backend.promotions.service;

import com.demeter.backend.promotions.model.Discount;
import com.demeter.backend.promotions.repo.DiscountRepository;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class DiscountApplicationService {

    private final DiscountRepository discountRepository;

    public DiscountApplicationService(DiscountRepository discountRepository) {
        this.discountRepository = discountRepository;
    }

    public BigDecimal calculateDiscount(Integer discountId, BigDecimal subtotal) {
        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));

        if (!discount.isValid()) {
            throw new AppException(ErrorCode.BAD_REQUEST);
        }

        String type = discount.getDiscountType();
        BigDecimal value = discount.getDiscountValue();

        if ("PERCENTAGE".equals(type)) {
            return subtotal.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else if ("FIXED_AMOUNT".equals(type) || "COMBO_FIXED_PRICE".equals(type)) {
            return value.min(subtotal);
        } else if ("BOGO".equals(type) || "BUY_X_GET_Y".equals(type)) {
            // For BOGO, the discount value represents the percentage off the free item
            return subtotal.multiply(value).divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        }

        return BigDecimal.ZERO;
    }

    public List<Discount> getApplicableDiscounts(Integer cafeteriaId) {
        return discountRepository.findByCafeteriaIdAndIsActive(cafeteriaId, true)
                .stream()
                .filter(Discount::isValid)
                .toList();
    }
}
