package com.clinica.psicologia.system.support_services.expert_system;

// import org.springframework.web.bind.annotation.PathVariable;
// import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
// import com.clinica.psicologia.system.repository.expert_system.EvaluacionDiagnosticaRepository;
// import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inference")
public class InferenceEngineController {

    // private final InferenceEngineService inferenceService;
    // private final EvaluacionDiagnosticaRepository evaluacionRepository;
    // private final InferenceMapper mapper;

    // @PostMapping("/evaluacion/{evaluacionId}")
    // public InferenceResponseDTO inferir(@PathVariable Integer evaluacionId) {

    //     InferenceResult result = inferenceService.inferir(evaluacionId);

    //     EvaluacionDiagnostica evaluacion = evaluacionRepository.findById(evaluacionId)
    //             .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));

    //     return mapper.toResponse(result, evaluacion.getDiagnosticoConfirmado());
    // }
}