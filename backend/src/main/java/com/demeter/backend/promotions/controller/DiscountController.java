package com.demeter.backend.promotions.controller;

import com.demeter.backend.promotions.dto.DiscountDTO;
import com.demeter.backend.promotions.model.Discount;
import com.demeter.backend.promotions.service.DiscountService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/discounts")
public class DiscountController {
    private final DiscountService discountService;
    private final ModelMapper modelMapper;

    public DiscountController(DiscountService discountService, ModelMapper modelMapper) {
        this.discountService = discountService;
        this.modelMapper = modelMapper;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DiscountDTO> createDiscount(@Valid @RequestBody DiscountDTO discountDTO) {
        Discount discount = modelMapper.map(discountDTO, Discount.class);
        Discount saved = discountService.createDiscount(discount);
        return ResponseEntity.ok(modelMapper.map(saved, DiscountDTO.class));
    }

    @GetMapping
    public ResponseEntity<List<DiscountDTO>> getAllDiscounts() {
        List<DiscountDTO> dtos = discountService.getAllDiscounts().stream()
                .map(d -> modelMapper.map(d, DiscountDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscountDTO> getDiscountById(@PathVariable Integer id) {
        return discountService.getDiscountById(id)
                .map(d -> ResponseEntity.ok(modelMapper.map(d, DiscountDTO.class)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/active")
    public ResponseEntity<List<DiscountDTO>> getActiveDiscounts() {
        List<DiscountDTO> dtos = discountService.getActiveDiscounts().stream()
                .map(d -> modelMapper.map(d, DiscountDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/cafeteria/{cafeteriaId}")
    public ResponseEntity<List<DiscountDTO>> getDiscountsByCafeteria(@PathVariable Integer cafeteriaId) {
        List<DiscountDTO> dtos = discountService.getDiscountsByCafeteria(cafeteriaId).stream()
                .map(d -> modelMapper.map(d, DiscountDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/cafeteria/{cafeteriaId}/active")
    public ResponseEntity<List<DiscountDTO>> getActiveDiscountsByCafeteria(@PathVariable Integer cafeteriaId) {
        List<DiscountDTO> dtos = discountService.getActiveDiscountsByCafeteria(cafeteriaId).stream()
                .map(d -> modelMapper.map(d, DiscountDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<DiscountDTO>> getPendingAIDiscounts() {
        List<DiscountDTO> dtos = discountService.getPendingAIDiscounts().stream()
                .map(d -> modelMapper.map(d, DiscountDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/cafeteria/{cafeteriaId}/pending")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<List<DiscountDTO>> getPendingAIDiscountsByCafeteria(@PathVariable Integer cafeteriaId) {
        List<DiscountDTO> dtos = discountService.getPendingAIDiscountsByCafeteria(cafeteriaId).stream()
                .map(d -> modelMapper.map(d, DiscountDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DiscountDTO> approveDiscount(@PathVariable Integer id,
                                                        @RequestParam Integer staffUserId) {
        Discount approved = discountService.approveDiscount(id, staffUserId);
        return ResponseEntity.ok(modelMapper.map(approved, DiscountDTO.class));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DiscountDTO> rejectDiscount(@PathVariable Integer id) {
        Discount rejected = discountService.rejectDiscount(id);
        return ResponseEntity.ok(modelMapper.map(rejected, DiscountDTO.class));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DiscountDTO> updateDiscount(@PathVariable Integer id,
                                                       @Valid @RequestBody DiscountDTO discountDTO) {
        Discount discount = modelMapper.map(discountDTO, Discount.class);
        Discount updated = discountService.updateDiscount(id, discount);
        return ResponseEntity.ok(modelMapper.map(updated, DiscountDTO.class));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Integer id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}/deactivate")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ResponseEntity<DiscountDTO> deactivateDiscount(@PathVariable Integer id) {
        Discount deactivated = discountService.deactivateDiscount(id);
        return ResponseEntity.ok(modelMapper.map(deactivated, DiscountDTO.class));
    }
}
