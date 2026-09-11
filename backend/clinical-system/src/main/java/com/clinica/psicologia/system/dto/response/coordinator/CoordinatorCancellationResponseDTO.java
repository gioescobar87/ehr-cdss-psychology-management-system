package com.clinica.psicologia.system.dto.response.coordinator;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CoordinatorCancellationResponseDTO {

    private Integer id;
    private Integer citaId;
    private Integer patientId;
    private String patientName;
    private Integer psychologistId;
    private String psychologistName;
    private Integer cancelledByUserId;
    private String cancelledByUserName;
    private LocalDateTime cancellationDate;
    private String reason;
    private Boolean requestedByPatient;
    private LocalDateTime appointmentDate;
    private String appointmentReason;
}