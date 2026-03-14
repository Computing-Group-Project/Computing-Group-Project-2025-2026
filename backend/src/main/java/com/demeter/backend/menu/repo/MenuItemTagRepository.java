package com.demeter.backend.menu.repo;

import com.demeter.backend.menu.model.MenuItemTag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MenuItemTagRepository extends JpaRepository<MenuItemTag, Long> {
    List<MenuItemTag> findByMenu_MenuId(Long menuId);
    List<MenuItemTag> findByTag_TagId(Integer tagId);
}
