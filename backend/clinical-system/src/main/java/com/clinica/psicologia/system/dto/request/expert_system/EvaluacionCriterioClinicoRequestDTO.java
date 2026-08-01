package com.clinica.psicologia.system.dto.request.expert_system;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluacionCriterioClinicoRequestDTO {

    @NotNull(message = "Diagnostic evaluation is required.")
    private Integer evaluacionDiagnosticaId;

    @NotNull(message = "Clinical criterion is required.")
    private Integer criterioClinicoId;

    @Size(max = 5000)
    private String observaciones;
}