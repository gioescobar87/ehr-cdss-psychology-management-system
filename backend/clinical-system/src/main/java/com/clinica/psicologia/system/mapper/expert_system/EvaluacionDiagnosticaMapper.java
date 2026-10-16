package com.clinica.psicologia.system.mapper.expert_system;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionDiagnosticaResponseDTO;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;

@Component
public class EvaluacionDiagnosticaMapper {
    
    public EvaluacionDiagnosticaResponseDTO toResponse(EvaluacionDiagnostica entity) {

        EvaluacionDiagnosticaResponseDTO dto = new EvaluacionDiagnosticaResponseDTO();

        dto.setId(entity.getId());

        dto.setSesionId(entity.getSesion().getId());

        if (entity.getDiagnosticoSugerido() != null) {

            dto.setDiagnosticoSugeridoId(entity.getDiagnosticoSugerido().getId());

            dto.setDiagnosticoSugerido(entity.getDiagnosticoSugerido().getNombre());
        }

        if (entity.getDiagnosticoSeleccionado() != null) {
            dto.setDiagnosticoSeleccionadoId(entity.getDiagnosticoSeleccionado().getId());
            dto.setDiagnosticoSeleccionado(entity.getDiagnosticoSeleccionado().getNombre());
            dto.setDiagnosticoFinalId(entity.getDiagnosticoSeleccionado().getId());
            dto.setDiagnosticoFinal(entity.getDiagnosticoSeleccionado().getNombre());
        }

        dto.setUsuarioId(entity.getUsuario().getId());

        dto.setUsuario(entity.getUsuario().getNombre());

        Integer concordance = entity.getConcordanciaDiagnostica();
        dto.setConcordanciaDiagnostica(concordance);
        dto.setDiagnosticoConfirmado(concordance == null ? null : concordance == 1);
        dto.setFechaHoraInferencia(entity.getFechaHoraInferencia());

        return dto;
    }

    public List<EvaluacionDiagnosticaResponseDTO> toResponseList(List<EvaluacionDiagnostica> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

}