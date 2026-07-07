package com.clinica.psicologia.system.dto.request.clinical;

import java.time.LocalDate;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PacienteDiagnosticoRequestDTO {

    @NotNull(message = "El paciente es obligatorio")
    private Integer pacienteId;

    @NotNull(message = "El diagnóstico es obligatorio")
    private Integer diagnosticoId;

    private Integer sesionId;

    @NotNull(message = "La fecha del diagnóstico es obligatoria")
    private LocalDate fechaDiagnostico;

    @NotNull(message = "El estado es obligatorio")
    private Integer estadoId;
}