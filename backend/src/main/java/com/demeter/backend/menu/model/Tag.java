package com.demeter.backend.menu.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "Tag")
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "tag_id")
    private Integer tagId;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "tag_type", length = 50)
    private String tagType;

    public Tag() {}

    public Tag(String name, String tagType) {
        this.name = name;
        this.tagType = tagType;
    }
}
