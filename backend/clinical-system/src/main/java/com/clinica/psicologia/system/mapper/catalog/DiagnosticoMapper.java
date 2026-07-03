package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoResponseDTO;
import com.clinica.psicologia.system.model.catalog.Diagnostico;

@Component
public class DiagnosticoMapper implements CatalogoMapper<Diagnostico, DiagnosticoRequestDTO, DiagnosticoResponseDTO> {

    @Override
    public DiagnosticoResponseDTO toResponse(Diagnostico entity) {

        DiagnosticoResponseDTO dto = new DiagnosticoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigoDsm(entity.getCodigoDsm());
        dto.setDescripcion(entity.getDescripcion());

        dto.setCategoriaDiagnosticaId(entity.getCategoriaDiagnostica().getId());

        dto.setCategoriaDiagnostica(entity.getCategoriaDiagnostica().getNombre());

        dto.setEstadoId(entity.getEstado().getId());

        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<DiagnosticoResponseDTO> toResponseList(
            List<Diagnostico> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(Diagnostico entity, DiagnosticoRequestDTO dto) {
        entity.setNombre(dto.getNombre());
        entity.setCodigoDsm(dto.getCodigoDsm());
        entity.setDescripcion(dto.getDescripcion());
    }
}