package com.demeter.backend.ai.controller;

import com.demeter.backend.ai.exception.AIServiceException;
import com.demeter.backend.ai.service.AIDiscountService;
import com.demeter.backend.promotions.dto.DiscountDTO;
import com.demeter.backend.promotions.model.Discount;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/ai/discounts")
@PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
public class AIDiscountController {

    private final AIDiscountService aiDiscountService;
    private final ModelMapper modelMapper;

    public AIDiscountController(AIDiscountService aiDiscountService, ModelMapper modelMapper) {
        this.aiDiscountService = aiDiscountService;
        this.modelMapper = modelMapper;
    }

    @PostMapping("/generate/{cafeteriaId}")
    public ResponseEntity<ApiResponse<List<DiscountDTO>>> generateDiscounts(
            @PathVariable Integer cafeteriaId) {
        try {
            List<Discount> discounts = aiDiscountService.generateDiscountsForCafeteria(cafeteriaId);

            List<DiscountDTO> discountDTOs = discounts.stream()
                    .map(d -> modelMapper.map(d, DiscountDTO.class))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(
                    new ApiResponse<>(true, ApiResponseMessages.AI_DISCOUNTS_GENERATED, discountDTOs));

        } catch (AIServiceException e) {
            log.error("AI service error while generating discounts for cafeteria {}: {}", cafeteriaId, e.getMessage());
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(new ApiResponse<>(false, "AI service is currently unavailable. Please try again later.", null));
        }
    }
}
