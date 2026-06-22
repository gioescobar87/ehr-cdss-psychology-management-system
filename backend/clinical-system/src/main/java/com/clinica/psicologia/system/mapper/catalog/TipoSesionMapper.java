package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.TipoSesionRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoSesionResponseDTO;
import com.clinica.psicologia.system.model.catalog.TipoSesion;

@Component
public class TipoSesionMapper implements CatalogoMapper<TipoSesion, TipoSesionRequestDTO, TipoSesionResponseDTO>{
    
    @Override
    public TipoSesionResponseDTO toResponse(TipoSesion entity) {

        TipoSesionResponseDTO dto = new TipoSesionResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<TipoSesionResponseDTO> toResponseList(List<TipoSesion> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(TipoSesion entity, TipoSesionRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
