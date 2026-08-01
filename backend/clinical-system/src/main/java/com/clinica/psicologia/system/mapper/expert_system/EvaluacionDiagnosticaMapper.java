package com.clinica.psicologia.system.mapper.expert_system;

import java.util.List;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.dto.request.expert_system.EvaluacionDiagnosticaRequestDTO;
import com.clinica.psicologia.system.dto.response.expert_system.EvaluacionDiagnosticaResponseDTO;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;

@Component
public class EvaluacionDiagnosticaMapper {
    
    public EvaluacionDiagnosticaResponseDTO toResponse(EvaluacionDiagnostica entity) {

        EvaluacionDiagnosticaResponseDTO dto = new EvaluacionDiagnosticaResponseDTO();

        dto.setId(entity.getId());

        dto.setSesionId(entity.getSesion().getId());

        dto.setArbolDiagnosticoId(entity.getArbolDiagnostico().getId());

        dto.setArbolDiagnostico(entity.getArbolDiagnostico().getNombre());

        if (entity.getDiagnosticoFinal() != null) {

            dto.setDiagnosticoFinalId(entity.getDiagnosticoFinal().getId());

            dto.setDiagnosticoFinal(entity.getDiagnosticoFinal().getNombre());
        }

        if (entity.getDiagnosticoSugerido() != null) {

            dto.setDiagnosticoSugeridoId(entity.getDiagnosticoSugerido().getId());

            dto.setDiagnosticoSugerido(entity.getDiagnosticoSugerido().getNombre());
        }

        dto.setUsuarioId(entity.getUsuario().getId());

        dto.setUsuario(entity.getUsuario().getNombre());

        dto.setVersionArbol(entity.getVersionArbol());

        dto.setDiagnosticoConfirmado(entity.getDiagnosticoConfirmado());

        dto.setObservacionesSistema(entity.getObservacionesSistema());

        dto.setFechaEvaluacion(entity.getFechaEvaluacion());

        dto.setFechaInferencia(entity.getFechaInferencia());

        dto.setTiempoInferenciaMs(entity.getTiempoInferenciaMs());

        dto.setEstadoId(entity.getEstado().getId());

        dto.setEstado(entity.getEstado().getNombre());

        return dto;
    }

    public List<EvaluacionDiagnosticaResponseDTO> toResponseList(List<EvaluacionDiagnostica> entities) {

        return entities.stream()
                .map(this::toResponse)
                .toList();
    }

    public void updateEntity(EvaluacionDiagnostica entity, EvaluacionDiagnosticaRequestDTO dto) {

        // Relationships are managed by the service.
    }
}