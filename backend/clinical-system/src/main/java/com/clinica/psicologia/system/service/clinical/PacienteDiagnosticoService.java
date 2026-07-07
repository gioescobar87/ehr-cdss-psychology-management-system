package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.PacienteDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PacienteDiagnosticoResponseDTO;

public interface PacienteDiagnosticoService {

    PacienteDiagnosticoResponseDTO create(
            PacienteDiagnosticoRequestDTO request);

    List<PacienteDiagnosticoResponseDTO> findAll();

    PacienteDiagnosticoResponseDTO findById(
            Integer id);

    List<PacienteDiagnosticoResponseDTO> getByPatient(
            Integer pacienteId);

    PacienteDiagnosticoResponseDTO update(
            Integer id,
            PacienteDiagnosticoRequestDTO request);

    void changeStatus(
            Integer id,
            Integer estadoId);

    void delete(
            Integer id);
}