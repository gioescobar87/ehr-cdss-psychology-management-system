package com.clinica.psicologia.system.dto.request.expert_system;

import com.fasterxml.jackson.annotation.JsonAlias;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluacionDiagnosticaRequestDTO {

    @NotNull(message = "La sesión es obligatoria")
    private Integer sesionId;

    @JsonAlias("diagnosticoFinalId")
    private Integer diagnosticoSeleccionadoId;
}