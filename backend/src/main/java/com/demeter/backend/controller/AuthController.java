package com.demeter.backend.controller;

import com.demeter.backend.dto.UserResponseDTO;
import com.demeter.backend.model.User;
import com.demeter.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody User user) {

        User savedUser = authService.register(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getEmail(),
                savedUser.getRole()
        );
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        return authService.login(user.getEmail(), user.getPassword());
    }
}
