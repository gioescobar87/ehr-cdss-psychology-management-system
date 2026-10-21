package com.clinica.psicologia.system.dto.response.coordinator;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CoordinatorDiagnosticAgreementResponseDTO {

    private Integer id;
    private Integer sessionId;
    private Integer patientId;
    private String patientName;
    private Integer psychologistId;
    private String psychologistName;
    private String suggestedDiagnosis;
    private String selectedDiagnosis;
    private Integer concordanciaDiagnostica;
    private LocalDateTime fechaHoraInferencia;
}