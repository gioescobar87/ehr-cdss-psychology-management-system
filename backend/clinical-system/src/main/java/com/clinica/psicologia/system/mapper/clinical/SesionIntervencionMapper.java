package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.clinical.SesionIntervencionResponseDTO;
import com.clinica.psicologia.system.model.clinical.SesionIntervencion;

@Component
public class SesionIntervencionMapper {
    public SesionIntervencionResponseDTO toResponseDTO(SesionIntervencion entity) {
        SesionIntervencionResponseDTO dto = new SesionIntervencionResponseDTO();
        dto.setId(entity.getId());
        dto.setSesionId(entity.getSesion().getId());

        dto.setIntervencionId(entity.getIntervencion().getId());
        dto.setIntervencion(entity.getIntervencion().getNombre());

        dto.setTipoIntervencionId(entity.getIntervencion().getTipoIntervencion().getId());
        dto.setTipoIntervencion(entity.getIntervencion().getTipoIntervencion().getNombre());

        return dto;
    }

    public List<SesionIntervencionResponseDTO> toResponseDTOList(List<SesionIntervencion> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }
}
