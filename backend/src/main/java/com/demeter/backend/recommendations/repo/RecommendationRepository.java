package com.demeter.backend.recommendations.repo;

import com.demeter.backend.recommendations.model.Recommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecommendationRepository extends JpaRepository<Recommendation, Long> {
    List<Recommendation> findByUserId(Long userId);
    List<Recommendation> findByItemId(Long itemId);
}
