package com.clinica.psicologia.system.dto.response.clinical_context;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ClinicalContextRiskDTO {

    private Integer id;

    private Integer tipoRiesgoId;

    private String tipoRiesgo;

    private Integer nivelRiesgoId;

    private String nivelRiesgo;

    private String observaciones;

    private LocalDateTime fecha;
}