package com.demeter.backend.users.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Student")
public class Student {

    @Id
    @Column(name = "user_id")
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "dietary_preferences", length = 255)
    private String dietaryPreferences;

    @Column(name = "university_id", length = 50)
    private String universityId;

    public Student() {}

    public Student(User user, String universityId) {
        this.user = user;
        this.universityId = universityId;
    }
}
