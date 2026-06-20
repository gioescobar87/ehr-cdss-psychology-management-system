package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.CategoriaDiagnosticaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CategoriaDiagnosticaResponseDTO;
import com.clinica.psicologia.system.model.catalog.CategoriaDiagnostica;

@Component
public class CategoriaDiagnosticaMapper implements CatalogoMapper<CategoriaDiagnostica, CategoriaDiagnosticaRequestDTO, CategoriaDiagnosticaResponseDTO> {
    
    @Override
    public CategoriaDiagnosticaResponseDTO toResponse(CategoriaDiagnostica entity) {

        CategoriaDiagnosticaResponseDTO dto = new CategoriaDiagnosticaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombreEstado());

        return dto;
    }

    @Override
    public List<CategoriaDiagnosticaResponseDTO> toResponseList(List<CategoriaDiagnostica> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(CategoriaDiagnostica entity, CategoriaDiagnosticaRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setDescripcion(request.getDescripcion());
    }
}
