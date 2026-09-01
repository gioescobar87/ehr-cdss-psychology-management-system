package com.clinica.psicologia.system.dto.request.security;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermisoRequestDTO {

    @NotBlank(message = "El nombre del permiso es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción del permiso es obligatoria")
    private String descripcion;
}