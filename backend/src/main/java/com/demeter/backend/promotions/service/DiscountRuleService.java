package com.demeter.backend.promotions.service;

import com.demeter.backend.promotions.model.DiscountRule;
import com.demeter.backend.promotions.repo.DiscountRuleRepository;
import com.demeter.backend.shared.enums.PromotionStatus;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DiscountRuleService {
    private final DiscountRuleRepository discountRuleRepository;

    public DiscountRuleService(DiscountRuleRepository discountRuleRepository) {
        this.discountRuleRepository = discountRuleRepository;
    }

    // Create a new discount rule
    public DiscountRule createDiscountRule(DiscountRule rule) {
        if (rule.getEffectiveFrom() == null) {
            rule.setEffectiveFrom(LocalDateTime.now());
        }
        rule.setCreatedAt(LocalDateTime.now());
        rule.setUpdatedAt(LocalDateTime.now());
        return discountRuleRepository.save(rule);
    }

    // Get discount rule by ID
    public Optional<DiscountRule> getDiscountRuleById(Long id) {
        return discountRuleRepository.findById(id);
    }

    // Get all discount rules
    public List<DiscountRule> getAllDiscountRules() {
        return discountRuleRepository.findAll();
    }

    // Get active discount rules
    public List<DiscountRule> getActiveDiscountRules() {
        return discountRuleRepository.findByStatus(PromotionStatus.ACTIVE);
    }

    // Get active discount rules within a time range
    public List<DiscountRule> getActiveDiscountRulesInRange(LocalDateTime from, LocalDateTime until) {
        return discountRuleRepository.findByStatusAndEffectiveFromBeforeAndEffectiveUntilAfter(
                PromotionStatus.ACTIVE, until, from);
    }

    // Get discount rules for a promotion
    public List<DiscountRule> getDiscountRulesByPromotion(Long promotionId) {
        return discountRuleRepository.findByPromotionId(promotionId);
    }

    // Update a discount rule
    public DiscountRule updateDiscountRule(Long id, DiscountRule rule) {
        return discountRuleRepository.findById(id).map(existing -> {
            existing.setRuleName(rule.getRuleName());
            existing.setRuleDescription(rule.getRuleDescription());
            existing.setRuleType(rule.getRuleType());
            existing.setRuleValue(rule.getRuleValue());
            existing.setMinOrderAmount(rule.getMinOrderAmount());
            existing.setMaxOrderAmount(rule.getMaxOrderAmount());
            existing.setMinItemCount(rule.getMinItemCount());
            existing.setMaxItemCount(rule.getMaxItemCount());
            existing.setEligibleItemCategories(rule.getEligibleItemCategories());
            existing.setEligibleUserRoles(rule.getEligibleUserRoles());
            existing.setStatus(rule.getStatus());
            existing.setStackable(rule.getStackable());
            existing.setEffectiveFrom(rule.getEffectiveFrom());
            existing.setEffectiveUntil(rule.getEffectiveUntil());
            existing.setUpdatedAt(LocalDateTime.now());
            return discountRuleRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("DiscountRule not found"));
    }

    // Delete a discount rule
    public void deleteDiscountRule(Long id) {
        discountRuleRepository.deleteById(id);
    }

    // Check if user qualifies for a discount rule
    public boolean userQualifiesForRule(Long ruleId, Double orderAmount, Integer itemCount, String userRole) {
        Optional<DiscountRule> rule = getDiscountRuleById(ruleId);
        if (rule.isEmpty()) {
            return false;
        }
        return rule.get().qualifiesForRule(orderAmount, itemCount, userRole);
    }

    // Get applicable discount rules for an order
    public List<DiscountRule> getApplicableRules(Double orderAmount, Integer itemCount, String userRole) {
        return getActiveDiscountRules().stream()
                .filter(rule -> rule.qualifiesForRule(orderAmount, itemCount, userRole))
                .toList();
    }

    // Calculate total discount from applicable rules
    public Double calculateTotalDiscount(Double orderAmount, Integer itemCount, String userRole) {
        List<DiscountRule> applicableRules = getApplicableRules(orderAmount, itemCount, userRole);
        Double totalDiscount = 0.0;

        for (DiscountRule rule : applicableRules) {
            if ((boolean) rule.getStackable()) {
                totalDiscount += rule.calculateDiscount(orderAmount - totalDiscount);
            }
        }

        // If no stackable rules, apply the best discount
        if (totalDiscount == 0 && !applicableRules.isEmpty()) {
            totalDiscount = applicableRules.get(0).calculateDiscount(orderAmount);
        }

        return totalDiscount;
    }

    // Deactivate a discount rule
    public DiscountRule deactivateDiscountRule(Long id) {
        return discountRuleRepository.findById(id).map(rule -> {
            rule.setStatus(PromotionStatus.INACTIVE);
            rule.setUpdatedAt(LocalDateTime.now());
            return discountRuleRepository.save(rule);
        }).orElseThrow(() -> new RuntimeException("DiscountRule not found"));
    }
}
