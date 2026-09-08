package com.clinica.psicologia.system.dto.response.report;

import java.time.LocalDateTime;

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
    private LocalDateTime fechaInicio;
    private String motivoInicio;
    private LocalDateTime fechaCierre;
    private String motivoCierre;
}