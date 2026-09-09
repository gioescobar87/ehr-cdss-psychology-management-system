package com.clinica.psicologia.system.dto.response.coordinator;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CoordinatorPatientDiagnosisDTO {

    private Integer diagnosisId;
    private String code;
    private String name;
    private LocalDate diagnosisDate;
    private Boolean initial;
}