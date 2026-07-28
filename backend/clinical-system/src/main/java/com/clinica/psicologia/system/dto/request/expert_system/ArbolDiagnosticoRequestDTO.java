package com.clinica.psicologia.system.dto.request.expert_system;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ArbolDiagnosticoRequestDTO {

    @NotBlank(message = "Tree code is required.")
    @Size(max = 100)
    private String codigoArbol;

    @NotNull(message = "Version is required.")
    @Min(value = 1)
    private Integer version;

    @NotBlank(message = "Name is required.")
    @Size(max = 200)
    private String nombre;

    @NotNull(message = "Diagnostic category is required.")
    private Integer categoriaDiagnosticaId;

    @NotNull(message = "State is required.")
    private Integer estadoId;
}