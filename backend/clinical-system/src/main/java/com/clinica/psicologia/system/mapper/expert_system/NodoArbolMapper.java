package com.clinica.psicologia.system.mapper.expert_system;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.expert_system.NodoArbolRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.NodoArbolResponseDTO;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;

@Component
public class NodoArbolMapper {

    public NodoArbolResponseDTO toResponse(NodoArbol entity) {

        NodoArbolResponseDTO dto = new NodoArbolResponseDTO();

        dto.setId(entity.getId());

        dto.setArbolDiagnosticoId(entity.getArbolDiagnostico().getId());

        dto.setArbolDiagnostico(entity.getArbolDiagnostico().getNombre());

        if (entity.getNodoPadre() != null) {
            dto.setNodoPadreId(entity.getNodoPadre().getId());
        }

        if (entity.getDiagnostico() != null) {
            dto.setDiagnosticoId(entity.getDiagnostico().getId());
            dto.setDiagnostico(entity.getDiagnostico().getNombre());
        }

        dto.setDescripcion(entity.getDescripcion());
        dto.setOrden(entity.getOrden());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<NodoArbolResponseDTO> toResponseList(List<NodoArbol> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(NodoArbol entity, NodoArbolRequestDTO dto) {
        entity.setDescripcion(dto.getDescripcion());
        entity.setOrden(dto.getOrden());
    }
}