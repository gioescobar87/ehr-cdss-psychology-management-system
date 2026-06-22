package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.EstadoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.EstadoResponseDTO;
import com.clinica.psicologia.system.model.catalog.Estado;

@Component
public class EstadoMapper {
    
    public EstadoResponseDTO toResponse(Estado entity) {
        EstadoResponseDTO dto = new EstadoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        
        return dto;
    }

    public List<EstadoResponseDTO> toResponseList(List<Estado> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(Estado entity, EstadoRequestDTO request){
        entity.setNombre(request.getNombre());
    }
}