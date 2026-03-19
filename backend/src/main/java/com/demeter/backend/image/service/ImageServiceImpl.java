package com.demeter.backend.image.service;

import com.demeter.backend.image.config.AppProperties;
import com.demeter.backend.image.dto.response.ImageUploadResponse;
import com.demeter.backend.image.exception.InvalidFileException;
import com.demeter.backend.image.util.FileValidationUtil;
import com.demeter.backend.image.util.ImageUrlBuilder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ImageServiceImpl implements ImageService {

    private final AppProperties appProperties;
    private final ImageStorageService imageStorageService;

    @Override
    public ImageUploadResponse upload(MultipartFile file, String folder, String oldPath) {
        if (file == null || file.isEmpty()) {
            throw new InvalidFileException("File is required.");
        }

        FileValidationUtil.validate(file, appProperties.getMaxFileBytes());

        String safeFolder = FileValidationUtil.sanitizeFolder(folder);

        Path uploadsRoot = Paths.get(appProperties.getUploadsDir()).toAbsolutePath().normalize();
        imageStorageService.ensureDirectory(uploadsRoot);

        Path folderPath = uploadsRoot.resolve(safeFolder).normalize();
        if (!folderPath.startsWith(uploadsRoot)) {
            throw new InvalidFileException("Invalid folder path.");
        }
        imageStorageService.ensureDirectory(folderPath);

        String extension = FileValidationUtil.detectExtension(file.getContentType());
        String filename = UUID.randomUUID() + extension;

        Path target = folderPath.resolve(filename).normalize();
        imageStorageService.save(file, target);

        if (oldPath != null && !oldPath.isBlank()) {
            deleteByRelativePath(oldPath);
        }

        String relativePath = safeFolder + "/" + filename;
        String url = ImageUrlBuilder.build(appProperties.getBaseUrl(), relativePath);

        return new ImageUploadResponse(relativePath, url);
    }

    @Override
    public void deleteByRelativePath(String relativePath) {
        if (relativePath == null || relativePath.isBlank()) return;

        Path uploadsRoot = Paths.get(appProperties.getUploadsDir()).toAbsolutePath().normalize();
        Path filePath = uploadsRoot.resolve(relativePath).normalize();

        if (!filePath.startsWith(uploadsRoot)) {
            throw new InvalidFileException("Invalid image path.");
        }

        imageStorageService.deleteIfExists(filePath);
    }
}
