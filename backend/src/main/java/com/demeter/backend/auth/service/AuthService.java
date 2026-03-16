package com.demeter.backend.auth.service;

import com.demeter.backend.auth.dto.response.LoginResponseDTO;
import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.shared.util.LogActivity;
import com.demeter.backend.users.model.Staff;
import com.demeter.backend.users.model.Student;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.StudentRepository;
import com.demeter.backend.users.repo.UserRepository;
import jakarta.persistence.EntityManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EntityManager entityManager;

    public AuthService(UserRepository userRepository, StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder, JwtUtil jwtUtil, EntityManager entityManager) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.entityManager = entityManager;
    }

    @LogActivity(action = "USER_REGISTER", targetTable = "USER")
    public User register(User user) {
        validatePasswordStrength(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @LogActivity(action = "USER_LOGIN", targetTable = "USER")
    public LoginResponseDTO login(String username, String password) {
        User user = userRepository.findByUsername(username)
                .orElseGet(() -> studentRepository.findByUniversityId(username)
                        .map(Student::getUser)
                        .filter(u -> "STUDENT".equals(u.getRole()))
                        .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS)));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole(), user.getId());

        Integer assignedCafeteriaId = null;
        if ("STAFF".equals(user.getRole())) {
            try {
                Staff staff = entityManager.find(Staff.class, user.getId());
                if (staff != null) {
                    assignedCafeteriaId = staff.getAssignedCafeteriaId();
                }
            } catch (Exception ignored) {
            }
        }

        return new LoginResponseDTO(token, user.getId(), user.getUsername(),
                user.getRole(), assignedCafeteriaId);
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8) {
            throw new AppException(ErrorCode.WEAK_PASSWORD);
        }
        boolean hasLetter = password.chars().anyMatch(Character::isLetter);
        boolean hasDigit = password.chars().anyMatch(Character::isDigit);
        if (!hasLetter || !hasDigit) {
            throw new AppException(ErrorCode.WEAK_PASSWORD);
        }
    }
}
