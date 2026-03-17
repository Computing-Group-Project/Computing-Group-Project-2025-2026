package com.demeter.backend.users.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "`User`")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;

    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    @Column(name = "password_hash")
    private String password;

    @NotBlank(message = "Role is required")
    @Pattern(regexp = "ADMIN|STUDENT|STAFF", message = "Role must be ADMIN, STUDENT, or STAFF")
    @Column(name = "role")
    private String role;

    @Column(name = "krakens_balance")
    private BigDecimal krakensBalance = BigDecimal.ZERO;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_login")
    private LocalDateTime lastLogin;

    public User() {}

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

}
