package com.demeter.backend.image.service;

import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;

public interface ImageStorageService {

    void ensureDirectory(Path dir);

    void save(MultipartFile file, Path targetPath);

    void deleteIfExists(Path targetPath);
}
