package com.clinica.psicologia.system.dto.request.expert_system;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EvaluacionDiagnosticaRequestDTO {

    @NotNull(message = "La sesión es obligatoria")
    private Integer sesionId;

    @NotNull(message = "El diagnóstico final es obligatorio")
    private Integer diagnosticoFinalId;
    
    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}