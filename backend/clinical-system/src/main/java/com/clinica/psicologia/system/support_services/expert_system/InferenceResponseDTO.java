package com.clinica.psicologia.system.support_services.expert_system;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InferenceResponseDTO {

    private Integer diagnosticoId;

    private String diagnostico;

    private Integer executionTimeMs;

    private String observacionesSistema;

    private Boolean diagnosticoConfirmado;
}