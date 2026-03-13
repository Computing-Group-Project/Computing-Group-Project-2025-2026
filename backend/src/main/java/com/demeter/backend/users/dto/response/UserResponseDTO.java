package com.demeter.backend.users.dto.response;

import lombok.Getter;

@Getter
public class UserResponseDTO {

    private Long id;
    private String username;
    private String role;

    public UserResponseDTO(Long id, String username, String role) {
        this.id = id;
        this.username = username;
        this.role = role;
    }

}
