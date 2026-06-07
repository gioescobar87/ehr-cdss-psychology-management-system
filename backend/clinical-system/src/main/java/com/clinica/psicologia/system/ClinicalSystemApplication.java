package com.clinica.psicologia.system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.scheduling.annotation.EnableScheduling;

import com.clinica.psicologia.system.security.config.JwtProperties;

@SpringBootApplication
@EnableConfigurationProperties(JwtProperties.class)
@EnableScheduling
public class ClinicalSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(ClinicalSystemApplication.class, args);
	}

}
