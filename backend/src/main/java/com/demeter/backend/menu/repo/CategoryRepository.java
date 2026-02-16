package com.demeter.backend.menu.repo;

import com.demeter.backend.menu.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
}
