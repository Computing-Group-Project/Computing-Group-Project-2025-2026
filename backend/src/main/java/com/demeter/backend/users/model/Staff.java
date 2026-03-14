package com.demeter.backend.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Staff")
public class Staff {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "assigned_cafeteria_id", nullable = false)
    private Integer assignedCafeteriaId;

    public Staff() {}

    public Staff(User user, Integer assignedCafeteriaId) {
        this.user = user;
        this.assignedCafeteriaId = assignedCafeteriaId;
    }
}
