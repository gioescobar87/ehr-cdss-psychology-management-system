package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.SustanciaAlergenaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.SustanciaAlergenaResponseDTO;
import com.clinica.psicologia.system.model.catalog.SustanciaAlergena;

@Component
public class SustanciaAlergenaMapper {

    public SustanciaAlergenaResponseDTO toResponse(
            SustanciaAlergena entity) {

        SustanciaAlergenaResponseDTO dto =
                new SustanciaAlergenaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setTipoSustanciaAlergenaId(
                entity.getTipoSustanciaAlergena().getId());

        dto.setTipoSustanciaAlergena(
                entity.getTipoSustanciaAlergena().getNombre());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<SustanciaAlergenaResponseDTO> toResponseList(
            List<SustanciaAlergena> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }
}