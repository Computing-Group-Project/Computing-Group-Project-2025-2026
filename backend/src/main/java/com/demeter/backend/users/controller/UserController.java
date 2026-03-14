package com.demeter.backend.users.controller;

import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.users.dto.response.UserResponseDTO;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.service.UserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<List<UserResponseDTO>> getUsersByRole(@RequestParam String role) {
        List<User> users = userService.getUsersByRole(role);
        List<UserResponseDTO> dtos = users.stream()
                .map(u -> new UserResponseDTO(u.getId(), u.getUsername(), u.getRole()))
                .toList();
        return new ApiResponse<>(true, ApiResponseMessages.USERS_FETCHED, dtos);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/staff")
    public ApiResponse<UserResponseDTO> createStaff(@RequestBody Map<String, Object> body) {
        String username = (String) body.get("username");
        String password = (String) body.get("password");
        Integer cafeteriaId = (Integer) body.get("cafeteriaId");

        User created = userService.createStaff(username, password, cafeteriaId);
        return new ApiResponse<>(true, ApiResponseMessages.STAFF_CREATED,
                new UserResponseDTO(created.getId(), created.getUsername(), created.getRole()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ApiResponse<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ApiResponse<>(true, ApiResponseMessages.USER_DELETED, null);
    }
}
