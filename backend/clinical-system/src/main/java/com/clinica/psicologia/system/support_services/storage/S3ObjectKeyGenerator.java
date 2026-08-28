package com.clinica.psicologia.system.support_services.storage;

import java.util.UUID;

import org.springframework.stereotype.Component;

@Component
public class S3ObjectKeyGenerator {
    private static final String PSYCHOLOGICAL_TEST_PATH = "clinical/psychological-tests/sessions";

    public String generatePsychologicalTestKey(Integer sessionId) {
        UUID objectId = UUID.randomUUID();

        return "%s/%d/%s.pdf".formatted(
            PSYCHOLOGICAL_TEST_PATH,
            sessionId,
            objectId
        );
    }
}
