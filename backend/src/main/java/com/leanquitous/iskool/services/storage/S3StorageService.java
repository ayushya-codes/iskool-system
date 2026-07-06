package com.leanquitous.iskool.services.storage;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class S3StorageService {

    private final S3Client s3Client;

    @Value("${iskool.s3.bucket-name}")
    private String bucketName;

    @Value("${iskool.s3.base-url}")
    private String baseUrl;

    /**
     * Uploads a file to S3 under the path: {tenantId}/{folder}/{uuid}-{originalFilename}
     * Returns the full public URL and the S3 key.
     */
    public UploadResult upload(Long tenantId, String folder, MultipartFile file) {
        String originalFilename = file.getOriginalFilename() != null ? file.getOriginalFilename() : "file";
        String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");
        String s3Key = String.format("%d/%s/%s-%s", tenantId, folder, UUID.randomUUID(), sanitizedFilename);

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(s3Key)
                    .contentType(file.getContentType())
                    .build();

            s3Client.putObject(putRequest, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            String fileUrl = String.format("%s/%s", baseUrl, s3Key);
            log.info("Uploaded file to S3: {}", s3Key);

            return UploadResult.builder()
                    .s3Key(s3Key)
                    .fileUrl(fileUrl)
                    .originalFilename(originalFilename)
                    .contentType(file.getContentType())
                    .fileSizeBytes(file.getSize())
                    .build();
        } catch (IOException e) {
            log.error("Failed to upload file to S3: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public void delete(String s3Key) {
        DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(s3Key)
                .build();
        s3Client.deleteObject(deleteRequest);
        log.info("Deleted file from S3: {}", s3Key);
    }

    @lombok.Builder
    @lombok.Data
    @lombok.AllArgsConstructor
    public static class UploadResult {
        private String s3Key;
        private String fileUrl;
        private String originalFilename;
        private String contentType;
        private Long fileSizeBytes;
    }
}
