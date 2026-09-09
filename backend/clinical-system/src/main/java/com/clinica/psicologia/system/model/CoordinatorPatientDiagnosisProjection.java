package com.clinica.psicologia.system.model;

import java.time.LocalDate;

public interface CoordinatorPatientDiagnosisProjection {

    Integer getPatientId();

    Integer getDiagnosisId();

    String getCode();

    String getName();

    LocalDate getDiagnosisDate();

    Boolean getInitial();
}