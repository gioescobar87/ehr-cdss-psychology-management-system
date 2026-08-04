package com.clinica.psicologia.system.support_services.expert_system;

import org.springframework.stereotype.Component;

@Component
public class InferenceMapper {

    public InferenceResponseDTO toResponse(InferenceResult result, Boolean confirmado) {

        InferenceResponseDTO dto = new InferenceResponseDTO();

        dto.setDiagnosticoId(result.getDiagnostico().getId());
        dto.setDiagnostico(result.getDiagnostico().getNombre());

        dto.setExecutionTimeMs(result.getExecutionTimeMs());

        dto.setObservacionesSistema(result.getObservacionesSistema());

        dto.setDiagnosticoConfirmado(confirmado);

        return dto;
    }
}