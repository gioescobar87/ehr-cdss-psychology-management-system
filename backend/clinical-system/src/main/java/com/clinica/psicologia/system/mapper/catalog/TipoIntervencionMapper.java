package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.TipoIntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoIntervencionResponseDTO;
import com.clinica.psicologia.system.model.catalog.TipoIntervencion;

@Component
public class TipoIntervencionMapper implements CatalogoMapper<TipoIntervencion, TipoIntervencionRequestDTO, TipoIntervencionResponseDTO> {
    @Override
    public TipoIntervencionResponseDTO toResponse(TipoIntervencion entity) {

        TipoIntervencionResponseDTO dto = new TipoIntervencionResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<TipoIntervencionResponseDTO> toResponseList(List<TipoIntervencion> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(TipoIntervencion entity, TipoIntervencionRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
