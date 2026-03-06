package com.demeter.backend.image.util;

public final class ImageUrlBuilder {

    private ImageUrlBuilder() {}

    public static String build(String baseUrl, String relativePath) {
        String base = (baseUrl == null) ? "" : baseUrl.trim();
        String path = (relativePath == null) ? "" : relativePath.trim();

        path = path.replace("\\", "/");

        while (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        while (path.startsWith("/")) path = path.substring(1);

        if (path.startsWith("images/")) {
            path = path.substring("images/".length());
        }

        return base + "/images/" + path;
    }
}
