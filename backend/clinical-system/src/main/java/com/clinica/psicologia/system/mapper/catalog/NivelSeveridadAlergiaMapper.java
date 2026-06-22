package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.NivelSeveridadAlergiaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelSeveridadAlergiaResponseDTO;
import com.clinica.psicologia.system.model.catalog.NivelSeveridadAlergia;

@Component
public class NivelSeveridadAlergiaMapper implements CatalogoMapper<NivelSeveridadAlergia, NivelSeveridadAlergiaRequestDTO, NivelSeveridadAlergiaResponseDTO> {
    
    @Override
    public NivelSeveridadAlergiaResponseDTO toResponse(NivelSeveridadAlergia entity) {

        NivelSeveridadAlergiaResponseDTO dto = new NivelSeveridadAlergiaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<NivelSeveridadAlergiaResponseDTO> toResponseList(List<NivelSeveridadAlergia> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(NivelSeveridadAlergia entity, NivelSeveridadAlergiaRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
