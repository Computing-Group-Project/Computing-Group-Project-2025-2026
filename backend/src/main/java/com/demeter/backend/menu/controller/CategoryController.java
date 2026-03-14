package com.demeter.backend.menu.controller;

import com.demeter.backend.menu.model.Category;
import com.demeter.backend.menu.repo.CategoryRepository;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ApiResponse<List<Category>> getAllCategories() {
        return new ApiResponse<>(true, ApiResponseMessages.CATEGORIES_FETCHED,
                categoryRepository.findAll());
    }
}
