package com.clinica.psicologia.system.mapper.catalog;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.catalog.DiagnosticoCriterioClinicoRequestDTO;
import com.clinica.psicologia.system.dto.response.catalog.DiagnosticoCriterioClinicoResponseDTO;
import com.clinica.psicologia.system.model.catalog.DiagnosticoCriterioClinico;

@Component
public class DiagnosticoCriterioClinicoMapper {

    public DiagnosticoCriterioClinicoResponseDTO toResponse(DiagnosticoCriterioClinico entity) {
        DiagnosticoCriterioClinicoResponseDTO dto = new DiagnosticoCriterioClinicoResponseDTO();

        dto.setId(entity.getId());
        dto.setDiagnosticoId(entity.getDiagnostico() != null ? entity.getDiagnostico().getId() : null);
        dto.setDiagnostico(entity.getDiagnostico() != null ? entity.getDiagnostico().getNombre() : null);
        dto.setCriterioClinicoId(entity.getCriterioClinico() != null ? entity.getCriterioClinico().getId() : null);
        dto.setCriterioClinico(entity.getCriterioClinico() != null ? entity.getCriterioClinico().getNombre() : null);
        dto.setReferenciaRegla(entity.getReferenciaRegla());

        return dto;
    }

    public List<DiagnosticoCriterioClinicoResponseDTO> toResponseList(List<DiagnosticoCriterioClinico> entities) {
        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(DiagnosticoCriterioClinico entity, DiagnosticoCriterioClinicoRequestDTO dto) {
        entity.setReferenciaRegla(dto.getReferenciaRegla());
    }
}
