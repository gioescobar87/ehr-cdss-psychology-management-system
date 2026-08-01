package com.clinica.psicologia.system.mapper.expert_system;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.model.expert_system.EvaluacionCriterioClinico;

@Component
public class EvaluacionCriterioClinicoMapper {

    public EvaluacionCriterioClinicoResponseDTO toResponse(
            EvaluacionCriterioClinico entity) {

        EvaluacionCriterioClinicoResponseDTO dto =
                new EvaluacionCriterioClinicoResponseDTO();

        dto.setId(entity.getId());

        dto.setEvaluacionDiagnosticaId(
                entity.getEvaluacionDiagnostica().getId());

        dto.setCriterioClinicoId(
                entity.getCriterioClinico().getId());

        dto.setCriterioCodigo(
                entity.getCriterioClinico().getCodigo());

        dto.setCriterioNombre(
                entity.getCriterioClinico().getNombre());

        dto.setCategoriaCriterioId(
                entity.getCriterioClinico()
                        .getCategoriaCriterioClinico()
                        .getId());

        dto.setCategoriaCriterio(
                entity.getCriterioClinico()
                        .getCategoriaCriterioClinico()
                        .getNombre());

        dto.setObservaciones(
                entity.getObservaciones());

        return dto;
    }

    public List<EvaluacionCriterioClinicoResponseDTO> toResponseList(
            List<EvaluacionCriterioClinico> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(
            EvaluacionCriterioClinico entity,
            EvaluacionCriterioClinicoRequestDTO dto) {

        entity.setObservaciones(
                dto.getObservaciones());
    }
}