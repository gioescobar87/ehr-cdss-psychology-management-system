package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.PlanTratamientoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.PlanTratamientoResponseDTO;

public interface PlanTratamientoService {

    List<PlanTratamientoResponseDTO> findAll();

    PlanTratamientoResponseDTO findById(Integer id);

    List<PlanTratamientoResponseDTO> getByPacienteDiagnostico(
            Integer pacienteDiagnosticoId);

    List<PlanTratamientoResponseDTO> getByPaciente(
            Integer pacienteId);

    PlanTratamientoResponseDTO create(
            PlanTratamientoRequestDTO dto);

    PlanTratamientoResponseDTO update(
            Integer id,
            PlanTratamientoRequestDTO dto);

    void changeStatus(
            Integer id,
            Integer estadoId);

    void delete(
            Integer id);

}