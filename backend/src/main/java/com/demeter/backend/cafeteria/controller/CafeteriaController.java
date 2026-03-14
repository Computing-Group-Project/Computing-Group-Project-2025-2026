package com.demeter.backend.cafeteria.controller;

import com.demeter.backend.cafeteria.model.Cafeteria;
import com.demeter.backend.cafeteria.service.CafeteriaService;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cafeterias")
public class CafeteriaController {

    private final CafeteriaService cafeteriaService;

    public CafeteriaController(CafeteriaService cafeteriaService) {
        this.cafeteriaService = cafeteriaService;
    }

    @GetMapping
    public ApiResponse<List<Cafeteria>> getAllCafeterias() {
        return new ApiResponse<>(true, ApiResponseMessages.CAFETERIAS_FETCHED,
                cafeteriaService.getAllActiveCafeterias());
    }

    @GetMapping("/{id}")
    public ApiResponse<Cafeteria> getCafeteriaById(@PathVariable Integer id) {
        return new ApiResponse<>(true, ApiResponseMessages.CAFETERIA_FETCHED,
                cafeteriaService.getCafeteriaById(id));
    }
}
