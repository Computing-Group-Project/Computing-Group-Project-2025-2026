package com.demeter.backend.promotions.controller;

import com.demeter.backend.promotions.dto.DiscountRuleDTO;
import com.demeter.backend.promotions.model.DiscountRule;
import com.demeter.backend.promotions.service.DiscountRuleService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discount-rules")
public class DiscountRuleController {
    private final DiscountRuleService discountRuleService;
    private final ModelMapper modelMapper;

    public DiscountRuleController(DiscountRuleService discountRuleService, ModelMapper modelMapper) {
        this.discountRuleService = discountRuleService;
        this.modelMapper = modelMapper;
    }

    // Create a new discount rule
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<DiscountRuleDTO> createDiscountRule(@RequestBody DiscountRuleDTO ruleDTO) {
        DiscountRule rule = modelMapper.map(ruleDTO, DiscountRule.class);
        DiscountRule savedRule = discountRuleService.createDiscountRule(rule);
        return ResponseEntity.ok(modelMapper.map(savedRule, DiscountRuleDTO.class));
    }

    // Get all discount rules
    @GetMapping
    public ResponseEntity<List<DiscountRuleDTO>> getAllDiscountRules() {
        List<DiscountRule> rules = discountRuleService.getAllDiscountRules();
        List<DiscountRuleDTO> dtos = rules.stream()
                .map(r -> modelMapper.map(r, DiscountRuleDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get a discount rule by ID
    @GetMapping("/{id}")
    public ResponseEntity<DiscountRuleDTO> getDiscountRuleById(@PathVariable Long id) {
        return discountRuleService.getDiscountRuleById(id)
                .map(r -> ResponseEntity.ok(modelMapper.map(r, DiscountRuleDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get active discount rules
    @GetMapping("/active/list")
    public ResponseEntity<List<DiscountRuleDTO>> getActiveDiscountRules() {
        List<DiscountRule> rules = discountRuleService.getActiveDiscountRules();
        List<DiscountRuleDTO> dtos = rules.stream()
                .map(r -> modelMapper.map(r, DiscountRuleDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get discount rules for a promotion
    @GetMapping("/promotion/{promotionId}")
    public ResponseEntity<List<DiscountRuleDTO>> getDiscountRulesByPromotion(@PathVariable Long promotionId) {
        List<DiscountRule> rules = discountRuleService.getDiscountRulesByPromotion(promotionId);
        List<DiscountRuleDTO> dtos = rules.stream()
                .map(r -> modelMapper.map(r, DiscountRuleDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get applicable rules for an order
    @GetMapping("/applicable")
    public ResponseEntity<List<DiscountRuleDTO>> getApplicableRules(
            @RequestParam Double orderAmount,
            @RequestParam Integer itemCount,
            @RequestParam(required = false) String userRole) {
        List<DiscountRule> rules = discountRuleService.getApplicableRules(orderAmount, itemCount, userRole);
        List<DiscountRuleDTO> dtos = rules.stream()
                .map(r -> modelMapper.map(r, DiscountRuleDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Update a discount rule
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<DiscountRuleDTO> updateDiscountRule(@PathVariable Long id, 
                                                              @RequestBody DiscountRuleDTO ruleDTO) {
        DiscountRule rule = modelMapper.map(ruleDTO, DiscountRule.class);
        DiscountRule updatedRule = discountRuleService.updateDiscountRule(id, rule);
        return ResponseEntity.ok(modelMapper.map(updatedRule, DiscountRuleDTO.class));
    }

    // Delete a discount rule
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDiscountRule(@PathVariable Long id) {
        discountRuleService.deleteDiscountRule(id);
        return ResponseEntity.noContent().build();
    }

    // Deactivate a discount rule
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<DiscountRuleDTO> deactivateDiscountRule(@PathVariable Long id) {
        DiscountRule deactivated = discountRuleService.deactivateDiscountRule(id);
        return ResponseEntity.ok(modelMapper.map(deactivated, DiscountRuleDTO.class));
    }
}
