package com.clinica.psicologia.system.dto.request.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ModuloRequestDTO {

    @NotBlank(message = "El nombre del módulo es obligatorio")
    private String nombre;

    @NotBlank(message = "La descripción del módulo es obligatoria")
    private String descripcion;

    private String icono;

    @NotNull
    private Integer orden;

    @NotNull(message = "El estado del módulo es obligatorio")
    private Integer estadoId;
}
