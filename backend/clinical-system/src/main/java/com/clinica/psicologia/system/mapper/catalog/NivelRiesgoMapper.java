package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.NivelRiesgoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelRiesgoResponseDTO;
import com.clinica.psicologia.system.model.catalog.NivelRiesgo;

@Component
public class NivelRiesgoMapper implements CatalogoMapper<NivelRiesgo, NivelRiesgoRequestDTO, NivelRiesgoResponseDTO> {
    
    @Override
    public NivelRiesgoResponseDTO toResponse(NivelRiesgo entity) {

        NivelRiesgoResponseDTO dto = new NivelRiesgoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombreEstado());

        return dto;
    }

    @Override
    public List<NivelRiesgoResponseDTO> toResponseList(List<NivelRiesgo> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(NivelRiesgo entity, NivelRiesgoRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
