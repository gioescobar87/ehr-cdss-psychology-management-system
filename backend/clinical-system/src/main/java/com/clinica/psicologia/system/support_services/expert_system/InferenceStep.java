package com.clinica.psicologia.system.support_services.expert_system;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InferenceStep {

    private String criterionCode;

    private String criterionName;

    private boolean present;
}