package com.demeter.backend.image.util;

import com.demeter.backend.image.exception.InvalidFileException;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Locale;
import java.util.Set;

public final class FileValidationUtil {

    private FileValidationUtil() {}

    private static final Set<String> ALLOWED_MIME = Set.of(
            "image/jpeg",
            "image/png"
    );

    public static void validate(MultipartFile file, long maxBytes) {
        // Size check
        if (file.getSize() > maxBytes) {
            throw new InvalidFileException("File size exceeds the maximum allowed size.");
        }

        // Content-Type check
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_MIME.contains(contentType.toLowerCase(Locale.ROOT))) {
            throw new InvalidFileException("Only JPEG and PNG images are allowed.");
        }

        // Signature (magic bytes) check
        verifySignature(file, contentType);
    }

    public static String sanitizeFolder(String folder) {
        if (folder == null || folder.isBlank()) return "general";

        // keep only safe characters
        String cleaned = folder.trim().toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9_-]", "");
        if (cleaned.isBlank()) return "general";

        // prevent path tricks (even though we strip slashes)
        if (cleaned.contains("..")) {
            throw new InvalidFileException("Invalid folder name.");
        }

        return cleaned;
    }

    public static String detectExtension(String contentType) {
        if (contentType == null) return "";

        String ct = contentType.toLowerCase(Locale.ROOT);
        if (ct.equals("image/jpeg")) return ".jpg";
        if (ct.equals("image/png")) return ".png";

        throw new InvalidFileException("Unsupported image type.");
    }

    private static void verifySignature(MultipartFile file, String contentType) {
        try (InputStream is = file.getInputStream()) {
            if ("image/jpeg".equalsIgnoreCase(contentType)) {
                if (!isJpeg(is)) throw new InvalidFileException("Invalid JPEG file.");
            } else if ("image/png".equalsIgnoreCase(contentType)) {
                if (!isPng(is)) throw new InvalidFileException("Invalid PNG file.");
            }
        } catch (IOException e) {
            throw new InvalidFileException("Unable to read uploaded file.");
        }
    }

    private static boolean isJpeg(InputStream is) throws IOException {
        // JPEG starts with: FF D8 FF
        byte[] header = new byte[3];
        int read = is.read(header);
        return read == 3
                && (header[0] & 0xFF) == 0xFF
                && (header[1] & 0xFF) == 0xD8
                && (header[2] & 0xFF) == 0xFF;
    }

    private static boolean isPng(InputStream is) throws IOException {
        // PNG starts with: 89 50 4E 47 0D 0A 1A 0A
        byte[] header = new byte[8];
        int read = is.read(header);
        return read == 8
                && (header[0] & 0xFF) == 0x89
                && (header[1] & 0xFF) == 0x50
                && (header[2] & 0xFF) == 0x4E
                && (header[3] & 0xFF) == 0x47
                && (header[4] & 0xFF) == 0x0D
                && (header[5] & 0xFF) == 0x0A
                && (header[6] & 0xFF) == 0x1A
                && (header[7] & 0xFF) == 0x0A;
    }
}
