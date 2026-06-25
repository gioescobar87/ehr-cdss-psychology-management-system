package com.clinica.psicologia.system.service.patient;

import java.util.List;

import com.clinica.psicologia.system.dto.request.patient.PacienteMedicamentoRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteMedicamentoResponseDTO;

public interface PacienteMedicamentoService {

    PacienteMedicamentoResponseDTO create(PacienteMedicamentoRequestDTO request);

    List<PacienteMedicamentoResponseDTO> findAll();

    PacienteMedicamentoResponseDTO findById(Integer id);

    List<PacienteMedicamentoResponseDTO> getByPatient(Integer pacienteId);

    PacienteMedicamentoResponseDTO update(Integer id, PacienteMedicamentoRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}