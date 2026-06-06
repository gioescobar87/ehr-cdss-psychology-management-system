package com.clinica.psicologia.system.security.dto;

import com.clinica.psicologia.system.security.validation.StrongPassword;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResetPasswordRequest {
    @NotBlank(message = "Token is required")
    private String token;
    @NotBlank(message = "New password is required")
    @StrongPassword
    private String newPassword;

}