package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.clinical.SesionCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.dto.request.clinical.SesionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.model.clinical.SesionCriterioClinico;

@Component
public class SesionCriterioClinicoMapper {

    public SesionCriterioClinicoResponseDTO toResponseDTO(SesionCriterioClinico entity) {
        SesionCriterioClinicoResponseDTO dto = new SesionCriterioClinicoResponseDTO();

        dto.setId(entity.getId());
        dto.setSesionId(entity.getSesion().getId());
        dto.setCriterioClinicoId(entity.getCriterioClinico().getId());
        dto.setCriterioNombre(entity.getCriterioClinico().getNombre());
        dto.setCategoriaCriterioClinicoId(
                entity.getCriterioClinico().getCategoriaCriterioClinico().getId());
        dto.setCategoriaCriterioClinico(
                entity.getCriterioClinico().getCategoriaCriterioClinico().getNombre());
        dto.setPresente(entity.getPresente());

        return dto;
    }

    public List<SesionCriterioClinicoResponseDTO> toResponseDTOList(
            List<SesionCriterioClinico> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(SesionCriterioClinico entity,
            SesionCriterioClinicoRequestDTO request) {
        entity.setPresente(request.getPresente());
    }
}