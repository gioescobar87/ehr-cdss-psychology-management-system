package com.clinica.psicologia.system.service.patient;

import com.clinica.psicologia.system.dto.request.patient.PacienteHistorialRequestDTO;

public interface PacienteHistorialService {
    void actualizar(Integer pacienteId, PacienteHistorialRequestDTO request);
}
