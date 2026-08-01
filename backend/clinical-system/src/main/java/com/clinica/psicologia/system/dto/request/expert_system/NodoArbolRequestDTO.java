package com.clinica.psicologia.system.dto.request.expert_system;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NodoArbolRequestDTO {

    @NotNull(message = "Diagnostic tree is required.")
    private Integer arbolDiagnosticoId;

    private Integer criterioClinicoId;

    private Integer nodoPresenteId;

    private Integer nodoAusenteId;

    private Integer diagnosticoId;

    private String descripcion;

    @NotNull(message = "State is required.")
    private Integer estadoId;
}