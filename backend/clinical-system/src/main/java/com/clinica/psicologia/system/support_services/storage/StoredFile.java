package com.clinica.psicologia.system.support_services.storage;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StoredFile {
    private String objectKey;
    private String fileName;
    private String contentType;
    private long size;
}
