package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.ParentescoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.ParentescoResponseDTO;
import com.clinica.psicologia.system.model.catalog.Parentesco;

@Component
public class ParentescoMapper {

    public ParentescoResponseDTO toResponse(Parentesco entity) {
        ParentescoResponseDTO dto = new ParentescoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<ParentescoResponseDTO> toResponseList(List<Parentesco> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(Parentesco entity, ParentescoRequestDTO request){
        entity.setNombre(request.getNombre());
    }
}