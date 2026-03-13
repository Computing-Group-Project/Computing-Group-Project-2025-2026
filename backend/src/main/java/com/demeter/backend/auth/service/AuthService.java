package com.demeter.backend.auth.service;

import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.shared.enums.ErrorCode;
import com.demeter.backend.shared.exception.AppException;
import com.demeter.backend.shared.util.LogActivity;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @LogActivity(action = "USER_REGISTER", targetTable = "USER")
    public User register(User user) {
        validatePasswordStrength(user.getPassword());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @LogActivity(action = "USER_LOGIN", targetTable = "USER")
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_CREDENTIALS));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_CREDENTIALS);
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole());
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
