package com.demeter.backend.promotions.controller;

import com.demeter.backend.promotions.dto.PromotionDTO;
import com.demeter.backend.promotions.model.Promotion;
import com.demeter.backend.promotions.service.PromotionService;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/promotions")
public class PromotionController {
    private final PromotionService promotionService;
    private final ModelMapper modelMapper;

    public PromotionController(PromotionService promotionService, ModelMapper modelMapper) {
        this.promotionService = promotionService;
        this.modelMapper = modelMapper;
    }

    // Create a new promotion
    @PostMapping
    public ResponseEntity<PromotionDTO> createPromotion(@RequestBody PromotionDTO promotionDTO) {
        Promotion promotion = modelMapper.map(promotionDTO, Promotion.class);
        Promotion savedPromotion = promotionService.createPromotion(promotion);
        return ResponseEntity.ok(modelMapper.map(savedPromotion, PromotionDTO.class));
    }

    // Get all promotions
    @GetMapping
    public ResponseEntity<List<PromotionDTO>> getAllPromotions() {
        List<Promotion> promotions = promotionService.getAllPromotions();
        List<PromotionDTO> dtos = promotions.stream()
                .map(p -> modelMapper.map(p, PromotionDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get a promotion by ID
    @GetMapping("/{id}")
    public ResponseEntity<PromotionDTO> getPromotionById(@PathVariable Long id) {
        return promotionService.getPromotionById(id)
                .map(p -> ResponseEntity.ok(modelMapper.map(p, PromotionDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    // Get active promotions
    @GetMapping("/active/list")
    public ResponseEntity<List<PromotionDTO>> getActivePromotions() {
        List<Promotion> promotions = promotionService.getActivePromotions();
        List<PromotionDTO> dtos = promotions.stream()
                .map(p -> modelMapper.map(p, PromotionDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get promotions by cafeteria
    @GetMapping("/cafeteria/{cafeteriaId}")
    public ResponseEntity<List<PromotionDTO>> getPromotionsByCafeteria(@PathVariable Long cafeteriaId) {
        List<Promotion> promotions = promotionService.getPromotionsByCafeteria(cafeteriaId);
        List<PromotionDTO> dtos = promotions.stream()
                .map(p -> modelMapper.map(p, PromotionDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Get active promotions by cafeteria
    @GetMapping("/cafeteria/{cafeteriaId}/active")
    public ResponseEntity<List<PromotionDTO>> getActivePromotionsByCafeteria(@PathVariable Long cafeteriaId) {
        List<Promotion> promotions = promotionService.getActivePromotionsByCafeteria(cafeteriaId);
        List<PromotionDTO> dtos = promotions.stream()
                .map(p -> modelMapper.map(p, PromotionDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Update a promotion
    @PutMapping("/{id}")
    public ResponseEntity<PromotionDTO> updatePromotion(@PathVariable Long id, 
                                                        @RequestBody PromotionDTO promotionDTO) {
        Promotion promotion = modelMapper.map(promotionDTO, Promotion.class);
        Promotion updatedPromotion = promotionService.updatePromotion(id, promotion);
        return ResponseEntity.ok(modelMapper.map(updatedPromotion, PromotionDTO.class));
    }

    // Delete a promotion
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePromotion(@PathVariable Long id) {
        promotionService.deletePromotion(id);
        return ResponseEntity.noContent().build();
    }

    // Deactivate a promotion
    @PutMapping("/{id}/deactivate")
    public ResponseEntity<PromotionDTO> deactivatePromotion(@PathVariable Long id) {
        Promotion deactivated = promotionService.deactivatePromotion(id);
        return ResponseEntity.ok(modelMapper.map(deactivated, PromotionDTO.class));
    }
}
