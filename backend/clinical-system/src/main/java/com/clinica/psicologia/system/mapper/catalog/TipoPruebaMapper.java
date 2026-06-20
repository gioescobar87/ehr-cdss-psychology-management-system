package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.TipoPruebaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.TipoPruebaResponseDTO;
import com.clinica.psicologia.system.model.catalog.TipoPrueba;

@Component
public class TipoPruebaMapper implements CatalogoMapper<TipoPrueba, TipoPruebaRequestDTO, TipoPruebaResponseDTO> {
    
    @Override
    public TipoPruebaResponseDTO toResponse(TipoPrueba entity) {

        TipoPruebaResponseDTO dto = new TipoPruebaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombreEstado());

        return dto;
    }

    @Override
    public List<TipoPruebaResponseDTO> toResponseList(List<TipoPrueba> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(TipoPrueba entity, TipoPruebaRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
