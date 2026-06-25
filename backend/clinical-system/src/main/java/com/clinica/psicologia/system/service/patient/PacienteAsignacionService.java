package com.clinica.psicologia.system.service.patient;

import java.util.List;

import com.clinica.psicologia.system.dto.request.patient.AsignarPacienteRequestDTO;
import com.clinica.psicologia.system.dto.request.patient.ReasignarPacienteRequestDTO;
import com.clinica.psicologia.system.dto.response.patient.PacienteAsignacionResponseDTO;

public interface PacienteAsignacionService {

    void asignarPaciente(Integer pacienteId,AsignarPacienteRequestDTO request);

    void reasignarPaciente(Integer pacienteId,ReasignarPacienteRequestDTO request);

    List<PacienteAsignacionResponseDTO> historialAsignaciones(Integer pacienteId);
}