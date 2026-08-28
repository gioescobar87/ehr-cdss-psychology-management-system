package com.clinica.psicologia.system.config.aws;

import org.springframework.boot.context.properties.ConfigurationProperties;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "aws.s3")
public class AwsS3Properties {
    private String bucket;
    private String region;
}
