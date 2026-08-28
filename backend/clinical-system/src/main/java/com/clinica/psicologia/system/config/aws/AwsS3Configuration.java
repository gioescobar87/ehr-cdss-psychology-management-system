package com.clinica.psicologia.system.config.aws;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import org.springframework.boot.context.properties.EnableConfigurationProperties;

@Configuration
@EnableConfigurationProperties(AwsS3Properties.class)
public class AwsS3Configuration {
    
    @Bean
    public S3Client s3Client(AwsS3Properties properties) {
        return S3Client.builder()
            .region(Region.of(properties.getRegion()))
            .credentialsProvider(DefaultCredentialsProvider.builder().build())
            .build();
    }
}
