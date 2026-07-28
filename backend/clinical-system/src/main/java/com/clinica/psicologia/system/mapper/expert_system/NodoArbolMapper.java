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
        dto.setArbolDiagnosticoNombre(entity.getArbolDiagnostico().getNombre());
        dto.setNodoPadreId(entity.getNodoPadre() != null ? entity.getNodoPadre().getId() : null);
        dto.setTipoNodo(entity.getTipoNodo());
        dto.setDescripcion(entity.getDescripcion());
        dto.setEsTerminal(entity.getEsTerminal());
        dto.setOrden(entity.getOrden());
        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());
        return dto;
    }

    public void updateEntity(NodoArbol entity, NodoArbolRequestDTO dto) {
        entity.setTipoNodo(dto.getTipoNodo());
        entity.setDescripcion(dto.getDescripcion());
        entity.setEsTerminal(dto.getEsTerminal());
        entity.setOrden(dto.getOrden());
    }

    public List<NodoArbolResponseDTO> toResponseList(List<NodoArbol> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }
}
