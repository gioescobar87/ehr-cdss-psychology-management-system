package com.clinica.psicologia.system.dto.request.expert_system;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NodoArbolRequestDTO {
    @NotNull(message = "Diagnostic tree is required.")
    private Integer arbolDiagnosticoId;

    private Integer nodoPadreId;

    @NotBlank(message = "Node type is required.")
    @Size(max = 50)
    private String tipoNodo;

    private String descripcion;

    @NotNull(message = "Terminal flag is required.")
    private Boolean esTerminal;

    private Integer orden;

    @NotNull(message = "State is required.")
    private Integer estadoId;
}
