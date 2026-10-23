package com.clinica.psicologia.system.support_services.expert_system;

public interface InferenceEngineService {
    InferenceResult inferir(Integer evaluacionId);

    InferenceResult inferirParaSesion(Integer sesionId, Integer diagnosticoSeleccionadoId);

    InferenceWorkflowDTO.PreparationResponse prepararParaSesion(
            Integer sesionId, InferenceWorkflowDTO.PreparationRequest request);

    InferenceWorkflowDTO.FinalResponse finalizarParaSesion(
            Integer sesionId, InferenceWorkflowDTO.FinalizeRequest request);
}
