package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.CategoriaCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CategoriaCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.model.catalog.CategoriaCriterioClinico;

@Component
public class CategoriaCriterioClinicoMapper implements CatalogoMapper<CategoriaCriterioClinico, CategoriaCriterioClinicoRequestDTO, CategoriaCriterioClinicoResponseDTO> {
    @Override
    public CategoriaCriterioClinicoResponseDTO toResponse(CategoriaCriterioClinico entity) {

        CategoriaCriterioClinicoResponseDTO dto = new CategoriaCriterioClinicoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<CategoriaCriterioClinicoResponseDTO> toResponseList(List<CategoriaCriterioClinico> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(CategoriaCriterioClinico entity, CategoriaCriterioClinicoRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
