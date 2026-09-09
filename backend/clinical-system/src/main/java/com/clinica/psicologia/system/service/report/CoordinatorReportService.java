package com.clinica.psicologia.system.service.report;

import java.time.LocalDate;
import java.util.List;

import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorPatientResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorSummaryResponseDTO;

public interface CoordinatorReportService {

    List<CoordinatorSummaryResponseDTO> getSummary(LocalDate startDate, LocalDate endDate);

    List<CoordinatorPatientResponseDTO> getPatients(String status, Integer psychologistId, String search);

    List<CitaResponseDTO> getAgenda(LocalDate startDate);
}
