package com.clinica.psicologia.system.support_services.storage;

import java.io.IOException;
import java.io.InputStream;

public interface S3FileStorageService {
    StoredFile store(
        InputStream inputStream,
        long contentLength,
        String contentType,
        String originalFileName,
        String objectKey
    ) throws IOException;

    InputStream retrieve(String objectKey);

    void delete(String objectKey);
}
