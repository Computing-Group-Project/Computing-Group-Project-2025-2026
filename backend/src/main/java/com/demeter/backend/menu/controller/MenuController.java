package com.demeter.backend.menu.controller;

import com.demeter.backend.menu.dto.MenuRequestDTO;
import com.demeter.backend.menu.model.Menu;
import com.demeter.backend.menu.service.MenuService;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/menus")
public class MenuController {

    private final MenuService service;

    public MenuController(MenuService service) {
        this.service = service;
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PostMapping("/{categoryId}")
    public ApiResponse<Menu> createMenu(@Valid @RequestBody MenuRequestDTO dto,
                                        @PathVariable Long categoryId) {
        Menu menu = new Menu();
        menu.setName(dto.getName());
        menu.setDescription(dto.getDescription());
        menu.setBasePrice(dto.getBasePrice());
        menu.setImageUrl(dto.getImageUrl());
        menu.setPreparationTime(dto.getPreparationTime());
        menu.setAvailable(dto.isAvailable());
        menu.setCafeteriaId(dto.getCafeteriaId());
        return new ApiResponse<>(true,
                ApiResponseMessages.MENU_CREATED,
                service.createMenu(menu, categoryId));
    }

    @GetMapping
    public ApiResponse<List<Menu>> getAllMenus() {
        return new ApiResponse<>(true,
                ApiResponseMessages.MENUS_FETCHED,
                service.getAllMenus());
    }

    @GetMapping("/{id}")
    public ApiResponse<Menu> getMenuById(@PathVariable Long id) {
        return new ApiResponse<>(true,
                ApiResponseMessages.MENU_FETCHED,
                service.getMenuById(id));
    }

    @GetMapping("/cafeteria/{cafeteriaId}")
    public ApiResponse<List<Menu>> getMenusByCafeteria(@PathVariable Long cafeteriaId) {
        return new ApiResponse<>(true,
                ApiResponseMessages.MENUS_FETCHED,
                service.getMenusByCafeteria(cafeteriaId));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PutMapping("/{id}")
    public ApiResponse<Menu> updateMenu(@PathVariable Long id, @Valid @RequestBody MenuRequestDTO dto) {
        Menu menu = new Menu();
        menu.setName(dto.getName());
        menu.setDescription(dto.getDescription());
        menu.setBasePrice(dto.getBasePrice());
        menu.setImageUrl(dto.getImageUrl());
        menu.setPreparationTime(dto.getPreparationTime());
        menu.setAvailable(dto.isAvailable());
        return new ApiResponse<>(true,
                ApiResponseMessages.MENU_UPDATED,
                service.updateMenu(id, menu));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @PutMapping("/{id}/availability")
    public ApiResponse<Menu> toggleAvailability(@PathVariable Long id) {
        return new ApiResponse<>(true,
                ApiResponseMessages.MENU_UPDATED,
                service.toggleAvailability(id));
    }

    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMenu(@PathVariable Long id) {
        service.deleteMenu(id);
        return new ApiResponse<>(true,
                ApiResponseMessages.MENU_DELETED,
                null);
    }
}
