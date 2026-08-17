package com.clinica.psicologia.system.dto.request.catalog;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DiagnosticoRequestDTO {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 200)
    private String nombre;

    @Size(max = 50)
    private String codigoDsm;

    private String descripcion;

    @NotNull(message = "La categoría diagnóstica es obligatoria")
    private Integer categoriaDiagnosticaId;
}