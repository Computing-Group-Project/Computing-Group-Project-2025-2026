package com.demeter.backend.menu.repo;

import com.demeter.backend.menu.model.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByCafeteriaId(Long cafeteriaId);
}
