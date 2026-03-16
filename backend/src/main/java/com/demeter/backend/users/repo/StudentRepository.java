package com.demeter.backend.users.repo;

import com.demeter.backend.users.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUniversityId(String universityId);
}
