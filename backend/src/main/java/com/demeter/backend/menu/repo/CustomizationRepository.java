package com.demeter.backend.menu.repo;

import com.demeter.backend.menu.model.Customization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomizationRepository extends JpaRepository<Customization, Long> {
}
