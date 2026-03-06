package com.demeter.backend.image.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
public class AppProperties {

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Value("${app.uploads-dir:uploads}")
    private String uploadsDir;

    @Value("${app.max-file-bytes:5242880}")
    private long maxFileBytes;
}
