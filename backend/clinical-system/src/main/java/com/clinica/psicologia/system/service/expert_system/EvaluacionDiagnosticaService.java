package com.clinica.psicologia.system.service.expert_system;

import java.util.List;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionDiagnosticaRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionDiagnosticaResponseDTO;

public interface EvaluacionDiagnosticaService {

    List<EvaluacionDiagnosticaResponseDTO> findAll();

    EvaluacionDiagnosticaResponseDTO findById(Integer id);

    List<EvaluacionDiagnosticaResponseDTO> findByPaciente(Integer pacienteId);

    List<EvaluacionDiagnosticaResponseDTO> findBySesion(Integer sesionId);

    EvaluacionDiagnosticaResponseDTO create(EvaluacionDiagnosticaRequestDTO request);

    EvaluacionDiagnosticaResponseDTO update(Integer id, EvaluacionDiagnosticaRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}