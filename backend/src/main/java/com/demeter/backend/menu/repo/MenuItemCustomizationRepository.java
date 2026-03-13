package com.demeter.backend.menu.repo;

import com.demeter.backend.menu.model.MenuItemCustomization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MenuItemCustomizationRepository extends JpaRepository<MenuItemCustomization, Long> {
}
