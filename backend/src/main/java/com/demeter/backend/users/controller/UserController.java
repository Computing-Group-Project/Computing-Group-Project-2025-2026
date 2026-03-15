package com.demeter.backend.users.controller;

import com.demeter.backend.shared.constants.ApiResponseMessages;
import com.demeter.backend.shared.dto.response.ApiResponse;
import com.demeter.backend.users.dto.response.UserResponseDTO;
import com.demeter.backend.users.model.Staff;
import com.demeter.backend.users.model.User;
import com.demeter.backend.users.service.UserService;
import jakarta.persistence.EntityManager;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class UserController {

    private final UserService userService;
    private final EntityManager entityManager;

    public UserController(UserService userService, EntityManager entityManager) {
        this.userService = userService;
        this.entityManager = entityManager;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/users")
    public ApiResponse<List<UserResponseDTO>> getUsersByRole(@RequestParam String role) {
        List<User> users = userService.getUsersByRole(role);
        List<UserResponseDTO> dtos = users.stream()
                .map(u -> {
                    UserResponseDTO dto = new UserResponseDTO(u.getId(), u.getUsername(), u.getRole());
                    if ("STUDENT".equals(role)) {
                        dto.setKrakensBalance(u.getKrakensBalance());
                    }
                    if ("STAFF".equals(role)) {
                        Staff staff = entityManager.find(Staff.class, u.getId());
                        if (staff != null) {
                            dto.setAssignedCafeteriaId(staff.getAssignedCafeteriaId());
                        }
                    }
                    return dto;
                })
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
        UserResponseDTO dto = new UserResponseDTO(created.getId(), created.getUsername(), created.getRole());
        dto.setAssignedCafeteriaId(cafeteriaId);
        return new ApiResponse<>(true, ApiResponseMessages.STAFF_CREATED, dto);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/users/{id}")
    public ApiResponse<String> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return new ApiResponse<>(true, ApiResponseMessages.USER_DELETED, null);
    }
}
