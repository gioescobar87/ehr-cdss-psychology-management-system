package com.clinica.psicologia.system.security.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Getter;
import lombok.Setter;

@Configuration
@ConfigurationProperties(prefix = "security.encryption")
@Getter
@Setter
public class EncryptionProperties {
    
    private String key;
}
