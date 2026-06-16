package com.clinica.psicologia.system.dto.request.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PermisoRequestDTO {

    @NotBlank(message = "El nombre del permiso es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción del permiso es obligatoria")
    private String descripcion;

    @NotNull(message = "El ID del módulo es obligatorio")
    private Integer moduloId;

}