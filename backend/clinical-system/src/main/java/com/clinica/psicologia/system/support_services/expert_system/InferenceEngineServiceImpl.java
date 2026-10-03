package com.clinica.psicologia.system.support_services.expert_system;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
import com.clinica.psicologia.system.model.expert_system.NodoArbol;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionDiagnosticaRepository;
import com.clinica.psicologia.system.repository.expert_system.NodoArbolRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InferenceEngineServiceImpl implements InferenceEngineService {

//     private final EvaluacionDiagnosticaRepository evaluacionRepository;
//     private final EvaluacionCriterioClinicoRepository evaluacionCriterioRepository;
//     private final NodoArbolRepository nodoRepository;
//     private final InferenceExplanationBuilder explanationBuilder;

//     @Override
//     public InferenceResult inferir(Integer evaluacionId) {

//         long start = System.nanoTime();

//         EvaluacionDiagnostica evaluacion = evaluacionRepository.findById(evaluacionId)
//                 .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));

//         NodoArbol rootNode = nodoRepository
//                 .findRootNode(evaluacion.getArbolDiagnostico().getId())
//                 .orElseThrow(
//                         () -> new ResourceNotFoundException("Root node not found for the selected diagnostic tree"));

//         Set<Integer> selectedCriteria = loadSelectedCriteria(evaluacion.getId());

//         List<InferenceStep> steps = new ArrayList<>();

//         NodoArbol terminalNode = traverse(rootNode, selectedCriteria, steps);

//         String explanation = explanationBuilder.build(steps, terminalNode.getDiagnostico());

//         Integer elapsed = Math.toIntExact((System.nanoTime() - start) / 1_000_000);

//         InferenceResult result = buildResult(terminalNode, explanation, elapsed);

//         updateEvaluation(evaluacion, result);

//         evaluacionRepository.save(evaluacion);

//         return result;
//     }

//     /**
//      * Loads every selected clinical criterion into memory.
//      */
//     private Set<Integer> loadSelectedCriteria(
//             Integer evaluacionId) {

//         return evaluacionCriterioRepository
//                 .findByEvaluacionDiagnosticaId(evaluacionId)
//                 .stream()
//                 .map(item -> item.getCriterioClinico().getId())
//                 .collect(Collectors.toSet());
//     }

//     /**
//      * Recursive traversal.
//      * Implemented in Part 2.
//      */
//     private NodoArbol traverse(
//             NodoArbol currentNode,
//             Set<Integer> selectedCriteria,
//             List<InferenceStep> steps) {

//         Set<Integer> visitedNodes = new HashSet<>();

//         while (currentNode.getDiagnostico() == null) {

//             /*
//              * Loop protection.
//              */
//             if (!visitedNodes.add(currentNode.getId())) {

//                 throw new BusinessRuleException(
//                         "Circular reference detected in diagnostic tree at node: "
//                                 + currentNode.getId());
//             }

//             /*
//              * Decision node validation.
//              */
//             if (currentNode.getCriterioClinico() == null) {

//                 throw new BusinessRuleException(
//                         "Decision node without clinical criterion: "
//                                 + currentNode.getId());
//             }

//             /*
//              * Both branches are mandatory.
//              */
//             if (currentNode.getNodoPresente() == null
//                     || currentNode.getNodoAusente() == null) {

//                 throw new BusinessRuleException(
//                         "Decision node without complete branches: "
//                                 + currentNode.getId());
//             }

//             boolean criterionPresent = selectedCriteria.contains(
//                     currentNode.getCriterioClinico().getId());

//             steps.add(
//                     new InferenceStep(
//                             currentNode.getCriterioClinico().getCodigo(),
//                             currentNode.getCriterioClinico().getNombre(),
//                             criterionPresent));

//             currentNode = criterionPresent
//                     ? currentNode.getNodoPresente()
//                     : currentNode.getNodoAusente();

//             if (currentNode == null) {

//                 throw new BusinessRuleException(
//                         "Diagnostic tree contains incomplete branch.");
//             }
//         }

//         /*
//          * Terminal validation.
//          */
//         if (currentNode.getDiagnostico() == null) {

//             throw new BusinessRuleException(
//                     "Inference finished without reaching diagnosis.");
//         }

//         return currentNode;
//     }

//     /**
//      * Updates the diagnostic evaluation with
//      * the inference result.
//      */
//     private void updateEvaluation(EvaluacionDiagnostica evaluacion, InferenceResult result) {

//         evaluacion.setDiagnosticoSugerido(result.getDiagnostico());

//         evaluacion.setDiagnosticoConfirmado(evaluacion.getDiagnosticoFinal()
//                 .getId()
//                 .equals(result.getDiagnostico().getId()));

//         evaluacion.setObservacionesSistema(result.getObservacionesSistema());

//         evaluacion.setFechaInferencia(LocalDateTime.now());

//         evaluacion.setTiempoInferenciaMs(result.getExecutionTimeMs());
//     }

//     /**
//      * Creates the inference result.
//      */
//     private InferenceResult buildResult(
//         NodoArbol terminalNode,
//         String explanation,
//         Integer executionTime) {

//         if (terminalNode.getDiagnostico() == null) {
//             throw new BusinessRuleException("Inference did not reach a terminal diagnosis node.");
//         }

//         InferenceResult result = new InferenceResult();

//         result.setDiagnostico(terminalNode.getDiagnostico());

//         result.setExecutionTimeMs(executionTime);

//         result.setObservacionesSistema(explanation);

//         return result;
//     }
}