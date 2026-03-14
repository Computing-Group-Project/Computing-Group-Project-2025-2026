package com.demeter.backend.auth.controller;

import com.demeter.backend.auth.dto.request.LoginRequestDTO;
import com.demeter.backend.auth.dto.response.LoginResponseDTO;
import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
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
    public ApiResponse<UserResponseDTO> register(@Valid @RequestBody User user) {
        User savedUser = authService.register(user);
        return new ApiResponse<>(true, "Registration successful",
                new UserResponseDTO(savedUser.getId(), savedUser.getUsername(), savedUser.getRole()));
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO request) {
        LoginResponseDTO response = authService.login(request.getUsername(), request.getPassword());
        return new ApiResponse<>(true, ApiResponseMessages.LOGIN_SUCCESS, response);
    }
}
