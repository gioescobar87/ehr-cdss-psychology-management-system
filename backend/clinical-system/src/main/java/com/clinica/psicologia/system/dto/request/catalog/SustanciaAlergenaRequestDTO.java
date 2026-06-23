package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SustanciaAlergenaRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200)
    private String nombre;

    private String descripcion;

    @NotNull(message = "El tipo de sustancia alergena es obligatorio")
    private Integer tipoSustanciaAlergenaId;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}