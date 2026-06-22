package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.TipoRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoRiesgoResponseDTO;
import com.clinica.psicologia.system.model.catalog.TipoRiesgo;

@Component
public class TipoRiesgoMapper implements CatalogoMapper<TipoRiesgo, TipoRiesgoRequestDTO, TipoRiesgoResponseDTO> {
    
    @Override
    public TipoRiesgoResponseDTO toResponse(TipoRiesgo entity) {

        TipoRiesgoResponseDTO dto = new TipoRiesgoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<TipoRiesgoResponseDTO> toResponseList(List<TipoRiesgo> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(TipoRiesgo entity, TipoRiesgoRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
