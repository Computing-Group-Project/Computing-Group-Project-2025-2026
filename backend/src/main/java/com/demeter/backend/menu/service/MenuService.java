package com.demeter.backend.menu.service;

import com.demeter.backend.menu.model.*;
import com.demeter.backend.menu.repo.*;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.shared.util.LogActivity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MenuService {

    private final MenuRepository menuRepo;
    private final CategoryRepository categoryRepo;

    public MenuService(MenuRepository menuRepo, CategoryRepository categoryRepo) {
        this.menuRepo = menuRepo;
        this.categoryRepo = categoryRepo;
    }

    @LogActivity(action = "CREATE_MENU_ITEM", targetTable = "MENU_ITEM")
    public Menu createMenu(Menu menu, Long categoryId) {
        Category category = categoryRepo.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        menu.setCategory(category);
        return menuRepo.save(menu);
    }

    public List<Menu> getAllMenus() {
        return menuRepo.findAll();
    }

    public List<Menu> getMenusByCafeteria(Long cafeteriaId) {
        return menuRepo.findByCafeteriaId(cafeteriaId);
    }

    public Menu getMenuById(Long id) {
        return menuRepo.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.MENU_NOT_FOUND));
    }

    @LogActivity(action = "UPDATE_MENU_ITEM", targetTable = "MENU_ITEM")
    public Menu updateMenu(Long id, Menu updated) {
        Menu existing = getMenuById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getBasePrice() != null) existing.setBasePrice(updated.getBasePrice());
        if (updated.getImageUrl() != null) existing.setImageUrl(updated.getImageUrl());
        if (updated.getPreparationTime() != null) existing.setPreparationTime(updated.getPreparationTime());
        existing.setAvailable(updated.isAvailable());
        return menuRepo.save(existing);
    }

    @LogActivity(action = "TOGGLE_MENU_AVAILABILITY", targetTable = "MENU_ITEM")
    public Menu toggleAvailability(Long id) {
        Menu menu = getMenuById(id);
        menu.setAvailable(!menu.isAvailable());
        return menuRepo.save(menu);
    }

    @LogActivity(action = "DELETE_MENU_ITEM", targetTable = "MENU_ITEM")
    public void deleteMenu(Long id) {
        Menu menu = getMenuById(id);
        menuRepo.delete(menu);
    }
}