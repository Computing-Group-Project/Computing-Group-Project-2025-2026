package com.demeter.backend.image.controller;

import com.demeter.backend.image.dto.response.ImageUploadResponse;
import com.demeter.backend.image.service.ImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/images")
@RequiredArgsConstructor
public class ImageController {

    private final ImageService imageService;

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ImageUploadResponse> upload(
            @RequestPart("file") MultipartFile file,
            @RequestParam(defaultValue = "general") String folder,
            @RequestParam(required = false) String oldPath
    ) {
        ImageUploadResponse response = imageService.upload(file, folder, oldPath);
        return ResponseEntity.ok(response);
    }
}
