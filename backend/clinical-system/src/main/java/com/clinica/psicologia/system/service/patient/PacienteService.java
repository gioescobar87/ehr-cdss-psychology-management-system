package com.clinica.psicologia.system.service.patient;

import java.util.List;

import com.clinica.psicologia.system.dto.request.patient.PacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteResponseDTO;

public interface PacienteService {

    PacienteResponseDTO crearPaciente(PacienteRequestDTO dto);

    List<PacienteResponseDTO> obtenerPacientes();

    PacienteResponseDTO obtenerPorId(Integer id);

    PacienteResponseDTO actualizarPaciente(Integer id, PacienteRequestDTO dto);
}