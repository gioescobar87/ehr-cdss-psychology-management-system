package com.clinica.psicologia.system.util.encryption;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.security.config.EncryptionProperties;

@Component
public class EncryptionKeyHolder {
    private static String secret;

    public EncryptionKeyHolder(EncryptionProperties properties){
        secret = properties.getKey();
    }

    public static String getSecret(){
        return secret;
    }
}
