package com.demeter.backend.reviews.repo;

import com.demeter.backend.reviews.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByUserId(Long userId);
    List<Review> findByCafeteriaId(Integer cafeteriaId);
    Optional<Review> findByOrderId(Long orderId);
    List<Review> findByIsApproved(Boolean isApproved);
}
