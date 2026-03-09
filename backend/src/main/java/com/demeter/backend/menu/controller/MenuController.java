package com.demeter.backend.menu.controller;

import com.demeter.backend.menu.model.Menu;
import com.demeter.backend.menu.service.MenuService;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.shared.constants.ApiResponseMessages;
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

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/{categoryId}")
    public ApiResponse<Menu> createMenu(@RequestBody Menu menu,
                                        @PathVariable Long categoryId) {
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

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ApiResponse<String> deleteMenu(@PathVariable Long id) {
        service.deleteMenu(id);
        return new ApiResponse<>(true,
                ApiResponseMessages.MENU_DELETED,
                null);
    }
}
