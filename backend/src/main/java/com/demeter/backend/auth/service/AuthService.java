package com.demeter.backend.auth.service;

import com.demeter.backend.config.security.JwtUtil;
import com.demeter.backend.shared.util.LogActivity; // Imported your new annotation
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.repo.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @LogActivity(action = "USER_REGISTER", targetTable = "USER")
    public User register(User user) {
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @LogActivity(action = "USER_LOGIN", targetTable = "USER")
    public String login(String email, String password) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(user.getEmail(), user.getRole());
    }
}