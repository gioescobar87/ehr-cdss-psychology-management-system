package com.clinica.psicologia.system.mapper.clinical;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.clinical.IntervencionRequestDTO;
import com.clinica.psicologia.system.dto.response.clinical.IntervencionResponseDTO;
import com.clinica.psicologia.system.mapper.catalog.CatalogoMapper;
import com.clinica.psicologia.system.model.clinical.Intervencion;

@Component
public class IntervencionMapper implements CatalogoMapper<Intervencion,IntervencionRequestDTO, IntervencionResponseDTO> {
    @Override
    public IntervencionResponseDTO toResponse(Intervencion entity) {

        IntervencionResponseDTO dto = new IntervencionResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setTipoIntervencionId(entity.getTipoIntervencion().getId());
        dto.setTipoIntervencion(entity.getTipoIntervencion().getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<IntervencionResponseDTO> toResponseList(List<Intervencion> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(Intervencion entity, IntervencionRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
