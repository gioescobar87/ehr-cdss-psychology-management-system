package com.clinica.psicologia.system.mapper.expert_system;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.expert_system.ArbolDiagnosticoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ArbolDiagnosticoResponseDTO;
import com.clinica.psicologia.system.model.expert_system.ArbolDiagnostico;

@Component
public class ArbolDiagnosticoMapper {

    public ArbolDiagnosticoResponseDTO toResponse(
            ArbolDiagnostico entity) {

        ArbolDiagnosticoResponseDTO dto =
                new ArbolDiagnosticoResponseDTO();

        dto.setId(entity.getId());

        dto.setCodigoArbol(entity.getCodigoArbol());

        dto.setVersion(entity.getVersion());

        dto.setNombre(entity.getNombre());

        dto.setCategoriaDiagnosticaId(
                entity.getCategoriaDiagnostica().getId());

        dto.setCategoriaDiagnostica(
                entity.getCategoriaDiagnostica().getNombre());

        dto.setEstadoId(
                entity.getEstado().getId());

        dto.setEstado(
                entity.getEstado().getNombre());

        dto.setFechaCreacion(
                entity.getFechaCreacion());

        return dto;
    }

    public List<ArbolDiagnosticoResponseDTO> toResponseList(
            List<ArbolDiagnostico> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(
            ArbolDiagnostico entity,
            ArbolDiagnosticoRequestDTO dto) {

        entity.setCodigoArbol(dto.getCodigoArbol());

        entity.setVersion(dto.getVersion());

        entity.setNombre(dto.getNombre());
    }
}