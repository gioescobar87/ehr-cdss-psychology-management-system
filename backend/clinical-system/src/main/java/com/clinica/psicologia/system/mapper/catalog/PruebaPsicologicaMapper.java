package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.PruebaPsicologicaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.PruebaPsicologicaResponseDTO;
import com.clinica.psicologia.system.model.catalog.PruebaPsicologica;

@Component
public class PruebaPsicologicaMapper {

    public PruebaPsicologicaResponseDTO toResponseDTO(PruebaPsicologica entity) {

        PruebaPsicologicaResponseDTO dto = new PruebaPsicologicaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setDescripcion(entity.getDescripcion());
        dto.setObjetivoPrueba(entity.getObjetivoPrueba());
        dto.setInstruccionesAplicacion(entity.getInstruccionesAplicacion());
        dto.setConsideraciones(entity.getConsideraciones());
        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<PruebaPsicologicaResponseDTO> toResponseList(List<PruebaPsicologica> entities) {
        return entities.stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public void updateEntity(PruebaPsicologica entity, PruebaPsicologicaRequestDTO dto) {

        entity.setNombre(dto.getNombre());
        entity.setDescripcion(dto.getDescripcion());
        entity.setObjetivoPrueba(dto.getObjetivoPrueba());
        entity.setInstruccionesAplicacion(dto.getInstruccionesAplicacion());
        entity.setConsideraciones(dto.getConsideraciones());
    }

}