package com.demeter.backend.cafeteria.service;

import com.demeter.backend.cafeteria.model.Cafeteria;
import com.demeter.backend.cafeteria.repo.CafeteriaRepository;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CafeteriaService {

    private final CafeteriaRepository cafeteriaRepository;

    public CafeteriaService(CafeteriaRepository cafeteriaRepository) {
        this.cafeteriaRepository = cafeteriaRepository;
    }

    public List<Cafeteria> getAllActiveCafeterias() {
        return cafeteriaRepository.findByIsActive(true);
    }

    public Cafeteria getCafeteriaById(Integer id) {
        return cafeteriaRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CAFETERIA_NOT_FOUND));
    }
}
