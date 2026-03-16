package com.demeter.backend.menu;

import com.demeter.backend.menu.model.Category;
import com.demeter.backend.menu.model.Menu;
import com.demeter.backend.menu.repo.CategoryRepository;
import com.demeter.backend.menu.repo.MenuRepository;
import com.demeter.backend.menu.service.MenuService;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private MenuRepository menuRepo;

    @Mock
    private CategoryRepository categoryRepo;

    @InjectMocks
    private MenuService menuService;

    @Test
    void createMenu_withValidCategory_shouldSave() {
        Category category = new Category();
        Menu menu = new Menu("Burger", "A tasty burger", new BigDecimal("45.00"), null);

        when(categoryRepo.findById(1L)).thenReturn(Optional.of(category));
        when(menuRepo.save(any(Menu.class))).thenAnswer(invocation -> {
            Menu saved = invocation.getArgument(0);
            saved.setMenuId(1L);
            return saved;
        });

        Menu result = menuService.createMenu(menu, 1L);

        assertNotNull(result.getMenuId());
        assertEquals(category, result.getCategory());
        verify(menuRepo).save(menu);
    }

    @Test
    void createMenu_withInvalidCategory_shouldThrow() {
        Menu menu = new Menu("Burger", "A tasty burger", new BigDecimal("45.00"), null);
        when(categoryRepo.findById(999L)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class,
                () -> menuService.createMenu(menu, 999L));
        assertEquals(ErrorCode.CATEGORY_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void getMenuById_withValidId_shouldReturn() {
        Menu menu = new Menu("Burger", "A tasty burger", new BigDecimal("45.00"), null);
        menu.setMenuId(1L);

        when(menuRepo.findById(1L)).thenReturn(Optional.of(menu));

        Menu result = menuService.getMenuById(1L);

        assertEquals("Burger", result.getName());
    }

    @Test
    void getMenuById_withInvalidId_shouldThrow() {
        when(menuRepo.findById(999L)).thenReturn(Optional.empty());

        AppException ex = assertThrows(AppException.class,
                () -> menuService.getMenuById(999L));
        assertEquals(ErrorCode.MENU_NOT_FOUND, ex.getErrorCode());
    }

    @Test
    void getAllMenus_shouldReturnAll() {
        when(menuRepo.findAll()).thenReturn(List.of(new Menu(), new Menu()));

        List<Menu> result = menuService.getAllMenus();

        assertEquals(2, result.size());
    }

    @Test
    void deleteMenu_withValidId_shouldDelete() {
        Menu menu = new Menu("Burger", "A tasty burger", new BigDecimal("45.00"), null);
        menu.setMenuId(1L);

        when(menuRepo.findById(1L)).thenReturn(Optional.of(menu));

        menuService.deleteMenu(1L);

        verify(menuRepo).delete(menu);
    }
}
