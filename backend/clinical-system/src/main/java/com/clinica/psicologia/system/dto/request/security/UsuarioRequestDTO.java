package com.clinica.psicologia.system.dto.request.security;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioRequestDTO {

    @NotBlank
    private String username;

    @NotBlank
    private String nombre;

    @NotBlank
    private String apellido;

    @Email
    @NotBlank
    private String correo;

    private Integer coordinadorId;
}