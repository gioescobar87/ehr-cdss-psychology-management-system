package com.clinica.psicologia.system.service.patient;

import java.util.List;

import com.clinica.psicologia.system.dto.request.patient.PacienteAlergiaRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAlergiaResponseDTO;

public interface PacienteAlergiaService {

    PacienteAlergiaResponseDTO create(PacienteAlergiaRequestDTO request);

    List<PacienteAlergiaResponseDTO> findAll();

    PacienteAlergiaResponseDTO findById(Integer id);

    List<PacienteAlergiaResponseDTO> getByPatient(Integer pacienteId);

    PacienteAlergiaResponseDTO update(Integer id, PacienteAlergiaRequestDTO request);

    void changeStatus(Integer id, Integer estadoId);

    void delete(Integer id);
}