package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.EstadoCivilRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.EstadoCivilResponseDTO;
import com.clinica.psicologia.system.model.catalog.EstadoCivil;

@Component
public class EstadoCivilMapper implements CatalogoMapper<EstadoCivil, EstadoCivilRequestDTO, EstadoCivilResponseDTO> {

    @Override
    public EstadoCivilResponseDTO toResponse(EstadoCivil entity) {

        EstadoCivilResponseDTO dto = new EstadoCivilResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<EstadoCivilResponseDTO> toResponseList(List<EstadoCivil> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(EstadoCivil entity, EstadoCivilRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}