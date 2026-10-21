package com.clinica.psicologia.system.controller.coordinator;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clinica.psicologia.system.dto.response.clinical.CitaResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorPatientResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorCancellationResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorDiagnosticAgreementResponseDTO;
import com.clinica.psicologia.system.dto.response.coordinator.CoordinatorSummaryResponseDTO;
import com.clinica.psicologia.system.service.coordinator.CoordinatorReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/coordinator-report")
@RequiredArgsConstructor
public class CoordinatorReportController {

    private final CoordinatorReportService service;

    @GetMapping("/summary")
    public List<CoordinatorSummaryResponseDTO> getSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return service.getSummary(startDate, endDate);
    }

    @GetMapping("/patients")
    public List<CoordinatorPatientResponseDTO> getPatients(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer psychologistId,
            @RequestParam(required = false) String search) {
        return service.getPatients(status, psychologistId, search);
    }

    @GetMapping("/agenda")
    public List<CitaResponseDTO> getAgenda(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return service.getAgenda(startDate);
    }

    @GetMapping("/cancellations")
    public List<CoordinatorCancellationResponseDTO> getCancellations() {
        return service.getCancellations();
    }

    @GetMapping("/diagnostic-concordance")
    public List<CoordinatorDiagnosticAgreementResponseDTO> getDiagnosticConcordance(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return service.getDiagnosticConcordance(startDate, endDate);
    }
}
