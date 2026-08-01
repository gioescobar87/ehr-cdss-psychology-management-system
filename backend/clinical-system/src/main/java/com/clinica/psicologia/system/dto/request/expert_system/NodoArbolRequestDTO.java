package com.clinica.psicologia.system.dto.request.expert_system;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NodoArbolRequestDTO {

    @NotNull(message = "El árbol diagnóstico es obligatorio")
    private Integer arbolDiagnosticoId;

    private Integer nodoPadreId;

    private Integer diagnosticoId;

    private String descripcion;

    private Integer orden;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}