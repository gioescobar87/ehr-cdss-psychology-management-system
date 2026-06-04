package com.clinica.psicologia.system.service.clinical;

import java.util.List;

import com.clinica.psicologia.system.dto.request.clinical.HistorialFamiliarRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialFamiliarResponseDTO;

public interface HistorialFamiliarService {
    HistorialFamiliarResponseDTO crear(
            HistorialFamiliarRequestDTO dto);

    List<HistorialFamiliarResponseDTO>
            obtenerPorPaciente(Integer pacienteId);
}
