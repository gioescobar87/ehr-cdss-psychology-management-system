package com.clinica.psicologia.system.support_services.expert_system;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inference")
public class InferenceEngineController {

    private final InferenceEngineService inferenceService;
    private final InferenceMapper mapper;

    @PostMapping("/evaluacion/{evaluacionId}")
    public InferenceResponseDTO inferir(@PathVariable Integer evaluacionId) {
        return mapper.toResponse(inferenceService.inferir(evaluacionId));
    }

    @PostMapping("/sesion/{sesionId}/preguntas")
    public InferenceWorkflowDTO.PreparationResponse preparar(@PathVariable Integer sesionId) {
        return inferenceService.prepararParaSesion(sesionId);
    }

    @PostMapping("/sesion/{sesionId}/finalizar")
    public InferenceWorkflowDTO.FinalResponse finalizar(
            @PathVariable Integer sesionId,
            @RequestBody InferenceWorkflowDTO.FinalizeRequest request) {
        return inferenceService.finalizarParaSesion(sesionId, request);
    }
}