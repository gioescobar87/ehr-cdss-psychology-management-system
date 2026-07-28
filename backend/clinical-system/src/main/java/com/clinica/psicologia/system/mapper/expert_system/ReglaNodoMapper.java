package com.clinica.psicologia.system.mapper.expert_system;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.expert_system.ReglaNodoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.ReglaNodoResponseDTO;
import com.clinica.psicologia.system.model.expert_system.ReglaNodo;

@Component
public class ReglaNodoMapper {

    public ReglaNodoResponseDTO toResponse(ReglaNodo entity) {

        ReglaNodoResponseDTO dto = new ReglaNodoResponseDTO();

        dto.setId(entity.getId());

        dto.setNodoOrigenId(entity.getNodoOrigen().getId());
        dto.setNodoOrigenDescripcion(entity.getNodoOrigen().getDescripcion());

        dto.setNodoDestinoId(entity.getNodoDestino().getId());
        dto.setNodoDestinoDescripcion(entity.getNodoDestino().getDescripcion());

        dto.setCampoEvaluado(entity.getCampoEvaluado());
        dto.setOperador(entity.getOperador());
        dto.setValorComparacion(entity.getValorComparacion());
        dto.setPonderacion(entity.getPonderacion());

        dto.setEstadoId(entity.getEstado().getId());
        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<ReglaNodoResponseDTO> toResponseList(List<ReglaNodo> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(ReglaNodo entity, ReglaNodoRequestDTO dto) {
        entity.setCampoEvaluado(dto.getCampoEvaluado());
        entity.setOperador(dto.getOperador());
        entity.setValorComparacion(dto.getValorComparacion());
        entity.setPonderacion(dto.getPonderacion());
    }
}