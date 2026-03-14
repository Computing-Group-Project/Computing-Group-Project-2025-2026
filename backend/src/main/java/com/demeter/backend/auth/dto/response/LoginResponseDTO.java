package com.demeter.backend.auth.dto.response;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginResponseDTO {
    private String token;
    private Long userId;
    private String username;
    private String role;
    private Integer assignedCafeteriaId;

    public LoginResponseDTO() {}

    public LoginResponseDTO(String token, Long userId, String username, String role, Integer assignedCafeteriaId) {
        this.token = token;
        this.userId = userId;
        this.username = username;
        this.role = role;
        this.assignedCafeteriaId = assignedCafeteriaId;
    }

}
