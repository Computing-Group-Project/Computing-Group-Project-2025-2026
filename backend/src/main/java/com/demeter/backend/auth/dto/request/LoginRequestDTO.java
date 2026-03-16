package com.demeter.backend.auth.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class LoginRequestDTO {

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    public LoginRequestDTO() {}

    public LoginRequestDTO(String username, String password) {
        this.username = username;
        this.password = password;
    }

}
