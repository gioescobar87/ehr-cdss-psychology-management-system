package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.NivelEscolaridadRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelEscolaridadResponseDTO;
import com.clinica.psicologia.system.model.catalog.NivelEscolaridad;

@Component
public class NivelEscolaridadMapper implements CatalogoMapper<NivelEscolaridad, NivelEscolaridadRequestDTO, NivelEscolaridadResponseDTO> {

    @Override
    public NivelEscolaridadResponseDTO toResponse(NivelEscolaridad entity) {

        NivelEscolaridadResponseDTO dto = new NivelEscolaridadResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<NivelEscolaridadResponseDTO> toResponseList(List<NivelEscolaridad> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(NivelEscolaridad entity, NivelEscolaridadRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}