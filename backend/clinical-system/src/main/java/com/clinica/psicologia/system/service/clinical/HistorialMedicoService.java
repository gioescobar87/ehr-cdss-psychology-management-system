package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.HistorialMedicoRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialMedicoResponseDTO;

public interface HistorialMedicoService {

    HistorialMedicoResponseDTO crear(
            HistorialMedicoRequestDTO dto);

    List<HistorialMedicoResponseDTO>
        obtenerPorPaciente(Integer pacienteId);
}
