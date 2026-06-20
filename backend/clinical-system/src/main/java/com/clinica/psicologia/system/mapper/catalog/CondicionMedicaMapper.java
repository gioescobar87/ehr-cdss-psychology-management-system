package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.CondicionMedicaRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.CondicionMedicaResponseDTO;
import com.clinica.psicologia.system.model.catalog.CondicionMedica;

@Component
public class CondicionMedicaMapper implements CatalogoMapper<CondicionMedica, CondicionMedicaRequestDTO, CondicionMedicaResponseDTO> {
    
    @Override
    public CondicionMedicaResponseDTO toResponse(CondicionMedica entity) {

        CondicionMedicaResponseDTO dto = new CondicionMedicaResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setCodigoReferencia(entity.getCodigoReferencia());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombreEstado());

        return dto;
    }

    @Override
    public List<CondicionMedicaResponseDTO> toResponseList(List<CondicionMedica> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(CondicionMedica entity, CondicionMedicaRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setCodigoReferencia(request.getCodigoReferencia());
        entity.setDescripcion(request.getDescripcion());
    }
}
