package com.clinica.psicologia.system.mapper.clinical;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.HistorialFamiliarRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.HistorialFamiliarResponseDTO;
import com.clinica.psicologia.system.model.clinical.HistorialFamiliar;

@Component
public class HistorialFamiliarMapper {
    public HistorialFamiliar toEntity(
            HistorialFamiliarRequestDTO dto) {

        HistorialFamiliar historial = new HistorialFamiliar();

        historial.setObservaciones(dto.observaciones());

        return historial;
    }

    public HistorialFamiliarResponseDTO toResponse(
            HistorialFamiliar historial) {

        return new HistorialFamiliarResponseDTO(
                historial.getId(),
                historial.getCondicionMedica().getId(),
                historial.getCondicionMedica().getNombre(),
                historial.getParentesco().getId(),
                historial.getParentesco().getNombre(),
                historial.getObservaciones()
        );
    }
}
