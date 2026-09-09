package com.clinica.psicologia.system.dto.response.coordinator;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CoordinatorPatientResponseDTO {

    private Integer patientId;
    private String patientName;

    private Integer psychologistId;
    private String psychologistName;

    private String status;

    private LocalDateTime startDate;
    private String startReason;

    private LocalDateTime closingDate;
    private String closingReason;

    private String referralSource;

    private Integer ultimaSesionId;

    private List<CoordinatorPatientDiagnosisDTO> diagnoses;
}