package com.demeter.backend.cafeteria.repo;

import com.demeter.backend.cafeteria.model.Cafeteria;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CafeteriaRepository extends JpaRepository<Cafeteria, Integer> {
    List<Cafeteria> findByIsActive(Boolean isActive);
}
