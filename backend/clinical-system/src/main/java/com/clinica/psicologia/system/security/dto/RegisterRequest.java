package com.clinica.psicologia.system.security.dto;

import com.clinica.psicologia.system.security.validation.StrongPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    @NotBlank(message = "Username is required")
    private String username;
    @NotBlank(message = "Password is required")
    @StrongPassword
    private String password;
    @NotBlank(message = "First name is required")
    private String nombre;
    @NotBlank(message = "Last name is required")
    private String apellido;
    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    private String correo;
    @NotBlank(message = "Role is required")
    private String roleName;

}
