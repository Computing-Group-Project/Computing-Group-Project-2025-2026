package com.demeter.backend.auth.controller;

import com.demeter.backend.users.dto.response.UserResponseDTO;
import com.demeter.backend.users.model.User;
import com.demeter.backend.auth.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public UserResponseDTO register(@Valid @RequestBody User user) {

        User savedUser = authService.register(user);

        return new UserResponseDTO(
                savedUser.getId(),
                savedUser.getUsername(),
                savedUser.getRole()
        );
    }

    @PostMapping("/login")
    public String login(@Valid @RequestBody User user) {
        return authService.login(user.getUsername(), user.getPassword());
    }
}
