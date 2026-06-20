package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.NivelConsistenciaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.NivelConsistenciaResponseDTO;
import com.clinica.psicologia.system.model.catalog.NivelConsistencia;

@Component
public class NivelConsistenciaMapper implements CatalogoMapper<NivelConsistencia, NivelConsistenciaRequestDTO, NivelConsistenciaResponseDTO> {
    @Override
    public NivelConsistenciaResponseDTO toResponse(NivelConsistencia entity) {

        NivelConsistenciaResponseDTO dto = new NivelConsistenciaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombreEstado());

        return dto;
    }

    @Override
    public List<NivelConsistenciaResponseDTO> toResponseList(List<NivelConsistencia> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(NivelConsistencia entity, NivelConsistenciaRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
