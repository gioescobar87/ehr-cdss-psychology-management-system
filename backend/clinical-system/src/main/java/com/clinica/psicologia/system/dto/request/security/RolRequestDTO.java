package com.clinica.psicologia.system.dto.request.security;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RolRequestDTO {

    @NotBlank
    private String nombre;

    private String descripcion;

    @NotNull
    private Integer estadoId;
}