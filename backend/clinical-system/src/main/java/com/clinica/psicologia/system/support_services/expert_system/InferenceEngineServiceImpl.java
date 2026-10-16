package com.clinica.psicologia.system.support_services.expert_system;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.clinical.Sesion;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
import com.clinica.psicologia.system.dto.request.clinical.PacienteDiagnosticoRequestDTO;
import com.clinica.psicologia.system.repository.catalog.DiagnosticoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.clinical.SesionRepository;
import com.clinica.psicologia.system.repository.expert_system.EvaluacionDiagnosticaRepository;
import com.clinica.psicologia.system.repository.expert_system.InferenceRuleRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;
import com.clinica.psicologia.system.security.exception.custom.ResourceNotFoundException;
import com.clinica.psicologia.system.service.clinical.PacienteDiagnosticoService;
import com.clinica.psicologia.system.support_services.app_support.ApplicationSupportService;
import com.clinica.psicologia.system.support_services.authorization.ClinicalAuthorizationService;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class InferenceEngineServiceImpl implements InferenceEngineService {

    private final EvaluacionDiagnosticaRepository evaluationRepository;
    private final SesionRepository sessionRepository;
    private final SesionCriterioClinicoRepository sessionCriteriaRepository;
    private final DiagnosticoRepository diagnosisRepository;
    private final InferenceRuleRepository ruleRepository;
    private final DiagnosticInferenceEvaluator inferenceEvaluator;
        private final DiagnosticRuleEvaluator ruleEvaluator;
    private final InferenceExplanationBuilder explanationBuilder;
    private final ClinicalAuthorizationService authorizationService;
    private final ApplicationSupportService supportService;
        private final PacienteDiagnosticoService patientDiagnosisService;

    @Override
    public InferenceResult inferir(Integer evaluationId) {
        EvaluacionDiagnostica evaluation = evaluationRepository.findById(evaluationId)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnostic evaluation not found"));
        authorize(evaluation.getSesion());
        return infer(evaluation);
    }

    @Override
    public InferenceResult inferirParaSesion(Integer sessionId, Integer selectedDiagnosisId) {
        Sesion session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        authorize(session);

        EvaluacionDiagnostica evaluation = evaluationRepository
                .findBySesionIdOrderByFechaHoraInferenciaDesc(sessionId)
                .stream()
                .findFirst()
                .orElseGet(() -> {
                    EvaluacionDiagnostica created = new EvaluacionDiagnostica();
                    created.setSesion(session);
                    created.setUsuario(authorizationService.getAuthenticatedUser());
                    return created;
                });
        evaluation.setUsuario(authorizationService.getAuthenticatedUser());

        if (selectedDiagnosisId != null) {
            Diagnostico selectedDiagnosis = diagnosisRepository.findById(selectedDiagnosisId)
                    .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
            evaluation.setDiagnosticoSeleccionado(selectedDiagnosis);
        }

        return infer(evaluation);
    }

        @Override
        public InferenceWorkflowDTO.PreparationResponse prepararParaSesion(Integer sessionId) {
        Sesion session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        authorize(session);
        PreparedCandidates prepared = prepareCandidates(session);
        return new InferenceWorkflowDTO.PreparationResponse(
            prepared.candidates().stream().map(this::toCandidate).toList(),
            collectQuestions(prepared));
        }

        @Override
        public InferenceWorkflowDTO.FinalResponse finalizarParaSesion(
            Integer sessionId, InferenceWorkflowDTO.FinalizeRequest request) {
        Sesion session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        authorize(session);
        if (request == null || request.diagnosticoSeleccionadoId() == null
            || request.diagnosticoInicial() == null) {
            throw new BusinessRuleException("A selected diagnosis and its initial status are required.");
        }

        PreparedCandidates prepared = prepareCandidates(session);
        Map<Integer, Integer> answers = validateAnswers(prepared, request.answers());
        List<Diagnostico> finalCandidates = prepared.candidates().stream()
            .filter(candidate -> passesExclusions(candidate, prepared.rulesByDiagnosis(), answers))
            .toList();

        Diagnostico selectedDiagnosis = diagnosisRepository.findById(request.diagnosticoSeleccionadoId())
            .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
        Integer activeStateId = supportService.getActiveState().getId();
        if (selectedDiagnosis.getEstado() == null
            || !activeStateId.equals(selectedDiagnosis.getEstado().getId())) {
            throw new BusinessRuleException("The selected diagnosis is inactive.");
        }

        Diagnostico suggestedDiagnosis = finalCandidates.size() == 1 ? finalCandidates.getFirst() : null;
        Integer concordance = suggestedDiagnosis != null
            && suggestedDiagnosis.getId().equals(selectedDiagnosis.getId()) ? 1 : 0;

        PacienteDiagnosticoRequestDTO patientDiagnosisRequest = new PacienteDiagnosticoRequestDTO();
        patientDiagnosisRequest.setSesionId(sessionId);
        patientDiagnosisRequest.setDiagnosticoId(selectedDiagnosis.getId());
        patientDiagnosisRequest.setDiagnosticoInicial(request.diagnosticoInicial());
        patientDiagnosisService.create(patientDiagnosisRequest);

        EvaluacionDiagnostica evaluation = evaluationRepository
            .findBySesionIdOrderByFechaHoraInferenciaDesc(sessionId)
            .stream()
            .findFirst()
            .orElseGet(EvaluacionDiagnostica::new);
        evaluation.setSesion(session);
        evaluation.setUsuario(authorizationService.getAuthenticatedUser());
        evaluation.setDiagnosticoSugerido(suggestedDiagnosis);
        evaluation.setDiagnosticoSeleccionado(selectedDiagnosis);
        evaluation.setConcordanciaDiagnostica(concordance);
        evaluation.setFechaHoraInferencia(LocalDateTime.now());
        evaluationRepository.save(evaluation);

        return new InferenceWorkflowDTO.FinalResponse(
            finalCandidates.stream().map(this::toCandidate).toList(),
            suggestedDiagnosis == null ? null : suggestedDiagnosis.getId(),
            selectedDiagnosis.getId(),
            concordance);
        }

    private InferenceResult infer(EvaluacionDiagnostica evaluation) {
        long start = System.nanoTime();

        Set<Integer> presentCriterionIds = sessionCriteriaRepository
                .findBySesionIdOrderByIdAsc(evaluation.getSesion().getId())
                .stream()
                .filter(criteria -> Boolean.TRUE.equals(criteria.getPresente()))
                .map(criteria -> criteria.getCriterioClinico().getId())
                .collect(Collectors.toSet());

        Integer activeStateId = supportService.getActiveState().getId();
        List<Diagnostico> activeDiagnoses = diagnosisRepository.findAll().stream()
                .filter(diagnosis -> diagnosis.getEstado() != null
                        && activeStateId.equals(diagnosis.getEstado().getId()))
                .toList();

        Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis =
            ruleRepository.findRulesByDiagnosis();
        Map<Integer, List<DiagnosticRuleEvaluator.CriterionReference>> referencesByDiagnosis =
            ruleRepository.findCriterionReferencesByDiagnosis();
        boolean hasUnansweredExclusion = activeDiagnoses.stream()
            .filter(diagnosis -> hasPresentCriterion(
                referencesByDiagnosis.get(diagnosis.getId()), presentCriterionIds))
            .filter(diagnosis -> rulesByDiagnosis.containsKey(diagnosis.getId()))
            .anyMatch(diagnosis -> rulesByDiagnosis.get(diagnosis.getId()).stream()
                .anyMatch(ruleEvaluator::isExclusionRule));
        if (hasUnansweredExclusion) {
            throw new BusinessRuleException(
                "Exclusion answers are required; use the session inference workflow.");
        }

        DiagnosticInferenceEvaluator.Outcome outcome = inferenceEvaluator.infer(
                activeDiagnoses,
            rulesByDiagnosis,
            referencesByDiagnosis,
                presentCriterionIds);

        Diagnostico suggestedDiagnosis = outcome.suggestedDiagnosis();
        evaluation.setDiagnosticoSugerido(suggestedDiagnosis);
        evaluation.setFechaHoraInferencia(LocalDateTime.now());
        evaluation.setConcordanciaDiagnostica(calculateConcordance(
                suggestedDiagnosis, evaluation.getDiagnosticoSeleccionado()));
        evaluationRepository.save(evaluation);

        InferenceResult result = new InferenceResult();
        result.setDiagnostico(suggestedDiagnosis);
        result.setObservacionesSistema(explanationBuilder.build(outcome));
        result.setExecutionTimeMs(Math.toIntExact((System.nanoTime() - start) / 1_000_000));
        result.setDiagnosticoConfirmado(evaluation.getConcordanciaDiagnostica() == null
                ? null
                : evaluation.getConcordanciaDiagnostica() == 1);
        return result;
    }

    private Integer calculateConcordance(Diagnostico suggested, Diagnostico selected) {
        if (suggested == null || selected == null) {
            return null;
        }
        return suggested.getId().equals(selected.getId()) ? 1 : 0;
    }

    private void authorize(Sesion session) {
        authorizationService.validateSessionOwner(session);
        authorizationService.validateAssignedPsychologist(session.getPaciente());
    }

    private PreparedCandidates prepareCandidates(Sesion session) {
        Integer activeStateId = supportService.getActiveState().getId();
        Set<Integer> presentCriterionIds = sessionCriteriaRepository
                .findBySesionIdOrderByIdAsc(session.getId())
                .stream()
                .filter(criteria -> Boolean.TRUE.equals(criteria.getPresente()))
                .filter(criteria -> criteria.getCriterioClinico() != null
                        && criteria.getCriterioClinico().getEstado() != null
                        && activeStateId.equals(criteria.getCriterioClinico().getEstado().getId()))
                .map(criteria -> criteria.getCriterioClinico().getId())
                .collect(Collectors.toSet());
        List<Diagnostico> activeDiagnoses = diagnosisRepository.findAll().stream()
                .filter(diagnosis -> diagnosis.getEstado() != null
                        && activeStateId.equals(diagnosis.getEstado().getId()))
                .sorted((left, right) -> left.getId().compareTo(right.getId()))
                .toList();
        Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis =
                ruleRepository.findRulesByDiagnosis();
        Map<Integer, List<DiagnosticRuleEvaluator.CriterionReference>> referencesByDiagnosis =
                ruleRepository.findCriterionReferencesByDiagnosis();
        List<Diagnostico> candidates = new ArrayList<>();

        for (Diagnostico diagnosis : activeDiagnoses) {
            Integer diagnosisId = diagnosis.getId();
            List<DiagnosticRuleEvaluator.Rule> rules = rulesByDiagnosis.get(diagnosisId);
            List<DiagnosticRuleEvaluator.CriterionReference> references =
                    referencesByDiagnosis.getOrDefault(diagnosisId, List.of());
            if (rules == null || rules.isEmpty() || !hasPresentCriterion(references, presentCriterionIds)) {
                continue;
            }
            DiagnosticRuleEvaluator.Result result = ruleEvaluator.evaluate(rules, references, presentCriterionIds);
            if (!result.supported()) {
                throw new BusinessRuleException(
                        "Invalid inference rule for diagnosis " + diagnosis.getNombre() + ": " + result.detail());
            }
            if (result.satisfied()) {
                candidates.add(diagnosis);
            }
        }
        return new PreparedCandidates(candidates, rulesByDiagnosis, referencesByDiagnosis, presentCriterionIds);
    }

    private List<InferenceWorkflowDTO.Question> collectQuestions(PreparedCandidates prepared) {
        Map<String, QuestionAssociations> questions = new LinkedHashMap<>();
        for (Diagnostico candidate : prepared.candidates()) {
            for (DiagnosticRuleEvaluator.Rule rule : prepared.rulesByDiagnosis()
                    .getOrDefault(candidate.getId(), List.of())) {
                if (!ruleEvaluator.isExclusionRule(rule)) {
                    continue;
                }
                if (rule.ruleId() == null) {
                    throw new BusinessRuleException("An exclusion rule is missing its identifier.");
                }
                QuestionAssociations association = questions.computeIfAbsent(
                        rule.parameter(), ignored -> new QuestionAssociations());
                association.ruleIds().add(rule.ruleId());
                association.diagnosisIds().add(candidate.getId());
            }
        }
        return questions.entrySet().stream()
                .map(entry -> new InferenceWorkflowDTO.Question(
                        entry.getKey(),
                        List.copyOf(entry.getValue().ruleIds()),
                        List.copyOf(entry.getValue().diagnosisIds())))
                .toList();
    }

    private Map<Integer, Integer> validateAnswers(
            PreparedCandidates prepared, List<InferenceWorkflowDTO.Answer> submittedAnswers) {
        Set<Integer> requiredRuleIds = prepared.candidates().stream()
                .flatMap(candidate -> prepared.rulesByDiagnosis().getOrDefault(candidate.getId(), List.of()).stream())
                .filter(ruleEvaluator::isExclusionRule)
                .map(DiagnosticRuleEvaluator.Rule::ruleId)
                .collect(Collectors.toSet());
        Map<Integer, Integer> answers = new LinkedHashMap<>();
        if (submittedAnswers != null) {
            for (InferenceWorkflowDTO.Answer answer : submittedAnswers) {
                if (answer == null || answer.ruleId() == null || answer.value() == null
                        || (answer.value() != 0 && answer.value() != 1)
                        || answers.putIfAbsent(answer.ruleId(), answer.value()) != null) {
                    throw new BusinessRuleException("Every exclusion question requires one explicit Sí/No answer.");
                }
            }
        }
        if (!answers.keySet().equals(requiredRuleIds)) {
            throw new BusinessRuleException("Answers must be provided for every required exclusion question.");
        }
        return answers;
    }

    private boolean passesExclusions(
            Diagnostico candidate,
            Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis,
            Map<Integer, Integer> answers) {
        for (DiagnosticRuleEvaluator.Rule rule : rulesByDiagnosis.getOrDefault(candidate.getId(), List.of())) {
            if (!ruleEvaluator.isExclusionRule(rule)) {
                continue;
            }
            DiagnosticRuleEvaluator.Result result = ruleEvaluator.evaluateExclusion(rule, answers.get(rule.ruleId()));
            if (!result.supported()) {
                throw new BusinessRuleException(result.detail());
            }
            if (!result.satisfied()) {
                return false;
            }
        }
        return true;
    }

    private boolean hasPresentCriterion(
            List<DiagnosticRuleEvaluator.CriterionReference> references, Set<Integer> presentCriterionIds) {
        return references != null && references.stream()
                .anyMatch(reference -> reference != null && reference.criterionId() != null
                        && presentCriterionIds.contains(reference.criterionId()));
    }

    private InferenceWorkflowDTO.Candidate toCandidate(Diagnostico diagnosis) {
        return new InferenceWorkflowDTO.Candidate(diagnosis.getId(), diagnosis.getNombre());
    }

    private record PreparedCandidates(
            List<Diagnostico> candidates,
            Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis,
            Map<Integer, List<DiagnosticRuleEvaluator.CriterionReference>> referencesByDiagnosis,
            Set<Integer> presentCriterionIds) {
    }

    private static class QuestionAssociations {
        private final Set<Integer> ruleIds = new LinkedHashSet<>();
        private final Set<Integer> diagnosisIds = new LinkedHashSet<>();

        Set<Integer> ruleIds() {
            return ruleIds;
        }

        Set<Integer> diagnosisIds() {
            return diagnosisIds;
        }
    }
}