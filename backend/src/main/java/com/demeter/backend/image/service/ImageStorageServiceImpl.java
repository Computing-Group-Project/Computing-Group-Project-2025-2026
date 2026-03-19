package com.demeter.backend.image.service;

import com.demeter.backend.image.exception.StorageException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;

@Service
public class ImageStorageServiceImpl implements ImageStorageService {

    @Override
    public void ensureDirectory(Path dir) {
        try {
            Files.createDirectories(dir);
        } catch (IOException e) {
            throw new StorageException("Failed to create directory: " + dir, e);
        }
    }

    @Override
    public void save(MultipartFile file, Path targetPath) {
        try {

            Path parent = targetPath.getParent();
            if (parent != null) {
                Files.createDirectories(parent);
            }

            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new StorageException("Failed to save file to: " + targetPath, e);
        }
    }

    @Override
    public void deleteIfExists(Path targetPath) {
        try {
            Files.deleteIfExists(targetPath);
        } catch (IOException e) {
            throw new StorageException("Failed to delete file: " + targetPath, e);
        }
    }
}
