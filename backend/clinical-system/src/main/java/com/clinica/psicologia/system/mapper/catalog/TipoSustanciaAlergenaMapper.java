package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.TipoSustanciaAlergenaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoSustanciaAlergenaResponseDTO;
import com.clinica.psicologia.system.model.catalog.TipoSustanciaAlergena;

@Component
public class TipoSustanciaAlergenaMapper implements
        CatalogoMapper<TipoSustanciaAlergena, TipoSustanciaAlergenaRequestDTO, TipoSustanciaAlergenaResponseDTO> {

    @Override
    public TipoSustanciaAlergenaResponseDTO toResponse(TipoSustanciaAlergena entity) {

        TipoSustanciaAlergenaResponseDTO dto = new TipoSustanciaAlergenaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<TipoSustanciaAlergenaResponseDTO> toResponseList(List<TipoSustanciaAlergena> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(TipoSustanciaAlergena entity, TipoSustanciaAlergenaRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
