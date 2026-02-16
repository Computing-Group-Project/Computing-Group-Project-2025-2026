package com.demeter.backend.image.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImageUploadRequest {

    private String folder;
    private String oldPath;
}
