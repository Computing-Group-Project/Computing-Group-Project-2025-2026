package com.demeter.backend.image.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ImageUploadResponse {

    private String relativePath;

    private String url;
}
