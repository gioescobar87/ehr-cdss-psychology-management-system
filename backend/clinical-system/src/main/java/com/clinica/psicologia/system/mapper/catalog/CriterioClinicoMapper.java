package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.CriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CriterioClinicoResponseDTO;
import com.clinica.psicologia.system.model.catalog.CriterioClinico;

@Component
public class CriterioClinicoMapper implements CatalogoMapper<CriterioClinico,CriterioClinicoRequestDTO,CriterioClinicoResponseDTO> {

    @Override
    public CriterioClinicoResponseDTO toResponse(
            CriterioClinico entity) {

        CriterioClinicoResponseDTO dto =
                new CriterioClinicoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigo(entity.getCodigo());
        dto.setDescripcion(entity.getDescripcion());

        dto.setCategoriaCriterioClinicoId(
                entity.getCategoriaCriterioClinico().getId());

        dto.setCategoriaCriterioClinico(
                entity.getCategoriaCriterioClinico().getNombre());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<CriterioClinicoResponseDTO> toResponseList(
            List<CriterioClinico> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(
            CriterioClinico entity,
            CriterioClinicoRequestDTO dto) {

        entity.setNombre(dto.getNombre());
        entity.setCodigo(dto.getCodigo());
        entity.setDescripcion(dto.getDescripcion());
    }
}