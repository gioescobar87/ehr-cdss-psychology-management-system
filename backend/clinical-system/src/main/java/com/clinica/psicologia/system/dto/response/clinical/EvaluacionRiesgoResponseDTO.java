package com.clinica.psicologia.system.dto.response.clinical;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class EvaluacionRiesgoResponseDTO {

    private Integer id;

    private Integer pacienteId;

    private String pacienteNombre;

    private Integer sesionId;

    private Integer tipoRiesgoId;

    private String tipoRiesgo;

    private Integer nivelRiesgoId;

    private String nivelRiesgo;

    private String observaciones;

    private LocalDateTime fecha;
}