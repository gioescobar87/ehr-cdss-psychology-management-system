package com.clinica.psicologia.system.dto.response.coordinator;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CoordinatorSummaryResponseDTO {

    private Integer psychologistId;

    private String psychologistName;

    private long patientCount;

    private long appointmentCount;

    private long attendedCount;

    private long cancelledCount;

    private double cancellationRate;
}