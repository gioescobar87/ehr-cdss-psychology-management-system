package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.MedicamentoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.MedicamentoResponseDTO;
import com.clinica.psicologia.system.model.catalog.Medicamento;

@Component
public class MedicamentoMapper implements CatalogoMapper<Medicamento, MedicamentoRequestDTO, MedicamentoResponseDTO> {
    
    @Override
    public MedicamentoResponseDTO toResponse(Medicamento entity) {

        MedicamentoResponseDTO dto = new MedicamentoResponseDTO();

        dto.setId(entity.getId());
        dto.setNombre(entity.getNombre());
        dto.setNombreComercial(entity.getNombreComercial());
        dto.setDescripcion(entity.getDescripcion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    @Override
    public List<MedicamentoResponseDTO> toResponseList(List<Medicamento> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    public void updateEntity(Medicamento entity, MedicamentoRequestDTO request) {

        entity.setNombre(request.getNombre());
        entity.setNombreComercial(request.getNombreComercial());
        entity.setDescripcion(request.getDescripcion());
    }
}
