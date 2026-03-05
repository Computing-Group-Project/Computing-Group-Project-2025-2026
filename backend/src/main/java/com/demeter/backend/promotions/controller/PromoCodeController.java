package com.demeter.backend.promotions.controller;

import com.demeter.backend.promotions.dto.PromoCodeDTO;
import com.demeter.backend.promotions.model.PromoCode;
import com.demeter.backend.promotions.service.PromoCodeService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/promo-codes")
public class PromoCodeController {
    private final PromoCodeService promoCodeService;
    private final ModelMapper modelMapper;

    public PromoCodeController(PromoCodeService promoCodeService, ModelMapper modelMapper) {
        this.promoCodeService = promoCodeService;
        this.modelMapper = modelMapper;
    }

    // Create a new promo code
    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<PromoCodeDTO> createPromoCode(@RequestBody PromoCodeDTO promoCodeDTO) {
        PromoCode promoCode = modelMapper.map(promoCodeDTO, PromoCode.class);
        PromoCode savedPromoCode = promoCodeService.createPromoCode(promoCode);
        return ResponseEntity.ok(modelMapper.map(savedPromoCode, PromoCodeDTO.class));
    }

    // Get all promo codes
    @GetMapping
    public ResponseEntity<List<PromoCodeDTO>> getAllPromoCodes() {
        List<PromoCode> promoCodes = promoCodeService.getAllPromoCodes();
        List<PromoCodeDTO> dtos = promoCodes.stream()
                .map(p -> modelMapper.map(p, PromoCodeDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get a promo code by ID
    @GetMapping("/{id}")
    public ResponseEntity<PromoCodeDTO> getPromoCodeById(@PathVariable Long id) {
        return promoCodeService.getPromoCodeById(id)
                .map(p -> ResponseEntity.ok(modelMapper.map(p, PromoCodeDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get a promo code by code string
    @GetMapping("/code/{code}")
    public ResponseEntity<PromoCodeDTO> getPromoCodeByCode(@PathVariable String code) {
        return promoCodeService.getPromoCodeByCode(code)
                .map(p -> ResponseEntity.ok(modelMapper.map(p, PromoCodeDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Validate a promo code
    @GetMapping("/code/{code}/validate")
    public ResponseEntity<Boolean> validatePromoCode(@PathVariable String code) {
        boolean isValid = promoCodeService.validatePromoCode(code);
        return ResponseEntity.ok(isValid);
    }

    // Get active promo codes
    @GetMapping("/active/list")
    public ResponseEntity<List<PromoCodeDTO>> getActivePromoCodes() {
        List<PromoCode> promoCodes = promoCodeService.getActivePromoCodes();
        List<PromoCodeDTO> dtos = promoCodes.stream()
                .map(p -> modelMapper.map(p, PromoCodeDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get promo codes for a promotion
    @GetMapping("/promotion/{promotionId}")
    public ResponseEntity<List<PromoCodeDTO>> getPromoCodesByPromotion(@PathVariable Long promotionId) {
        List<PromoCode> promoCodes = promoCodeService.getPromoCodesByPromotion(promotionId);
        List<PromoCodeDTO> dtos = promoCodes.stream()
                .map(p -> modelMapper.map(p, PromoCodeDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Update a promo code
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<PromoCodeDTO> updatePromoCode(@PathVariable Long id, 
                                                        @RequestBody PromoCodeDTO promoCodeDTO) {
        PromoCode promoCode = modelMapper.map(promoCodeDTO, PromoCode.class);
        PromoCode updatedPromoCode = promoCodeService.updatePromoCode(id, promoCode);
        return ResponseEntity.ok(modelMapper.map(updatedPromoCode, PromoCodeDTO.class));
    }

    // Delete a promo code
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromoCode(@PathVariable Long id) {
        promoCodeService.deletePromoCode(id);
        return ResponseEntity.noContent().build();
    }

    // Deactivate a promo code
    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<PromoCodeDTO> deactivatePromoCode(@PathVariable Long id) {
        PromoCode deactivated = promoCodeService.deactivatePromoCode(id);
        return ResponseEntity.ok(modelMapper.map(deactivated, PromoCodeDTO.class));
    }
}
