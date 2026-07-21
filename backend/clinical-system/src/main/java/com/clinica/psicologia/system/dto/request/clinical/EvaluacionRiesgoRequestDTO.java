package com.clinica.psicologia.system.dto.request.clinical;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EvaluacionRiesgoRequestDTO {

    @NotNull(message = "El paciente es obligatorio")
    private Integer pacienteId;

    @NotNull(message = "La sesión es obligatoria")
    private Integer sesionId;

    @NotNull(message = "El tipo de riesgo es obligatorio")
    private Integer tipoRiesgoId;

    @NotNull(message = "El nivel de riesgo es obligatorio")
    private Integer nivelRiesgoId;

    private String observaciones;

    @NotNull(message = "La fecha de la evaluación es obligatoria")
    private LocalDateTime fecha;
}