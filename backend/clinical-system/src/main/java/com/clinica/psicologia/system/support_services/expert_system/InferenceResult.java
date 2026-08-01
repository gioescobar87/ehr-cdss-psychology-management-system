package com.clinica.psicologia.system.support_services.expert_system;

import com.clinica.psicologia.system.model.catalog.Diagnostico;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InferenceResult {

    private Diagnostico diagnostico;

    private String observacionesSistema;

    private Integer executionTimeMs;
}