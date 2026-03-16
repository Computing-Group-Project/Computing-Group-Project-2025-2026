package com.demeter.backend.menu.repo;

import com.demeter.backend.menu.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Integer> {
    List<Tag> findByTagType(String tagType);
}
