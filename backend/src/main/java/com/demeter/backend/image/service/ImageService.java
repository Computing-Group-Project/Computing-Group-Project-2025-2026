package com.demeter.backend.image.service;

import com.demeter.backend.image.dto.response.ImageUploadResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ImageService {

    ImageUploadResponse upload(MultipartFile file, String folder, String oldPath);

    void deleteByRelativePath(String relativePath);
}
