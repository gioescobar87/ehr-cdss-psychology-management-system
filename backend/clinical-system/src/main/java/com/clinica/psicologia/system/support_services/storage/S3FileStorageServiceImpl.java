package com.clinica.psicologia.system.support_services.storage;

import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.config.aws.AwsS3Properties;

import lombok.RequiredArgsConstructor;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@RequiredArgsConstructor
public class S3FileStorageServiceImpl implements S3FileStorageService {
    private final S3Client client;
    private final AwsS3Properties properties;

    @Override
    public StoredFile store(
        InputStream inputStream,
        long contentLength,
        String contentType,
        String originalFileName,
        String objectKey
    ) throws IOException {
        PutObjectRequest request = PutObjectRequest.builder()
            .bucket(properties.getBucket())
            .key(objectKey)
            .contentType(contentType)
            .contentLength(contentLength)
            .build();

        client.putObject(
            request,
            RequestBody.fromInputStream(inputStream, contentLength)
        );

        StoredFile file = new StoredFile();

        file.setObjectKey(objectKey);
        file.setFileName(originalFileName);
        file.setContentType(contentType);
        file.setSize(contentLength);

        return file;
    }

    @Override
    public InputStream retrieve(String objectKey) {
        GetObjectRequest request = GetObjectRequest.builder()
            .bucket(properties.getBucket())
            .key(objectKey)
            .build();

        return client.getObject(request);
    }

    @Override
    public void delete(String objectKey) {
        DeleteObjectRequest request = DeleteObjectRequest.builder()
            .bucket(properties.getBucket())
            .key(objectKey)
            .build();

        client.deleteObject(request);
    }
}
