package com.clinica.psicologia.system.support_services.expert_system;

import org.springframework.stereotype.Component;

@Component
public class InferenceMapper {

    public InferenceResponseDTO toResponse(InferenceResult result) {

        InferenceResponseDTO dto = new InferenceResponseDTO();

        if (result.getDiagnostico() != null) {
            dto.setDiagnosticoId(result.getDiagnostico().getId());
            dto.setDiagnostico(result.getDiagnostico().getNombre());
        }

        dto.setExecutionTimeMs(result.getExecutionTimeMs());

        dto.setObservacionesSistema(result.getObservacionesSistema());

        dto.setDiagnosticoConfirmado(result.getDiagnosticoConfirmado());

        return dto;
    }
}