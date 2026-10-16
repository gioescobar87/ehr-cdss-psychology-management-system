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

    private static final String SELECTED_RULES_FAILURE_DIAGNOSIS =
            "El diagnóstico seleccionado ya fue modelado, pero no cumple con las reglas definidas";

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
    public InferenceWorkflowDTO.PreparationResponse prepararParaSesion(
            Integer sessionId, InferenceWorkflowDTO.PreparationRequest request) {
        if (request == null || request.diagnosticoSeleccionadoId() == null) {
            throw new BusinessRuleException("A selected diagnosis is required.");
        }
        Sesion session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new ResourceNotFoundException("Session not found"));
        authorize(session);
        Diagnostico selectedDiagnosis = findActiveDiagnosis(request.diagnosticoSeleccionadoId());
        InferenceContext context = loadInferenceContext(session);
        List<Diagnostico> selectedFirstCandidates = selectedFirstCandidate(
            selectedDiagnosis, context);
        PreparedCandidates prepared = selectedFirstCandidates != null
                ? new PreparedCandidates(selectedFirstCandidates, context.rulesByDiagnosis(),
                        context.referencesByDiagnosis(), context.presentCriterionIds())
                : prepareCandidates(context);
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

        Diagnostico selectedDiagnosis = findActiveDiagnosis(request.diagnosticoSeleccionadoId());
        InferenceContext context = loadInferenceContext(session);
        Map<Integer, Integer> answers = parseAnswers(request.answers());
        List<DiagnosticRuleEvaluator.Rule> selectedRules =
                context.rulesByDiagnosis().get(selectedDiagnosis.getId());
        boolean selectedModeled = selectedRules != null && !selectedRules.isEmpty();
        boolean selectedFailed = false;

        if (selectedModeled) {
            DiagnosticRuleEvaluator.Result basicResult = ruleEvaluator.evaluate(
                    selectedRules,
                    context.referencesByDiagnosis().getOrDefault(selectedDiagnosis.getId(), List.of()),
                    context.presentCriterionIds());
            if (!basicResult.supported()) {
                throw new BusinessRuleException(
                        "Invalid inference rule for selected diagnosis: " + basicResult.detail());
            }
            if (basicResult.satisfied()) {
                List<Diagnostico> selectedOnly = List.of(selectedDiagnosis);
                List<InferenceWorkflowDTO.Question> missingQuestions = collectMissingQuestions(
                        selectedOnly, context.rulesByDiagnosis(), answers);
                if (!missingQuestions.isEmpty()) {
                    validateAnswerIds(answers, exclusionRuleIds(selectedRules));
                    return pendingResponse(selectedOnly, missingQuestions, selectedDiagnosis.getId());
                }
                if (passesExclusions(selectedDiagnosis, context.rulesByDiagnosis(), answers)) {
                    validateAnswerIds(answers, exclusionRuleIds(selectedRules));
                    return persistFinal(session, selectedDiagnosis, selectedDiagnosis,
                            List.of(selectedDiagnosis), 1, request.diagnosticoInicial());
                }
                selectedFailed = true;
            } else {
                selectedFailed = true;
            }
        }

        PreparedCandidates normalCandidates = prepareCandidates(context);
        Set<Integer> allowedRuleIds = new LinkedHashSet<>();
        if (selectedModeled) {
            allowedRuleIds.addAll(exclusionRuleIds(selectedRules));
        }
        normalCandidates.candidates().stream()
                .map(candidate -> context.rulesByDiagnosis().getOrDefault(candidate.getId(), List.of()))
                .forEach(rules -> allowedRuleIds.addAll(exclusionRuleIds(rules)));
        reuseSharedQuestionAnswers(answers, normalCandidates.candidates(),
            context.rulesByDiagnosis(), selectedModeled ? selectedRules : List.of());
        validateAnswerIds(answers, allowedRuleIds);

        List<InferenceWorkflowDTO.Question> missingQuestions = collectMissingQuestions(
                normalCandidates.candidates(), context.rulesByDiagnosis(), answers);
        if (!missingQuestions.isEmpty()) {
            return pendingResponse(normalCandidates.candidates(), missingQuestions, selectedDiagnosis.getId());
        }

        List<Diagnostico> finalCandidates = normalCandidates.candidates().stream()
                .filter(candidate -> passesExclusions(candidate, context.rulesByDiagnosis(), answers))
                .toList();
        Diagnostico suggestedDiagnosis = finalCandidates.size() == 1 ? finalCandidates.getFirst() : null;
        Integer concordance = suggestedDiagnosis != null
                && suggestedDiagnosis.getId().equals(selectedDiagnosis.getId()) ? 1 : 0;
        if (finalCandidates.isEmpty() && selectedFailed) {
            suggestedDiagnosis = diagnosisRepository.findByNombre(SELECTED_RULES_FAILURE_DIAGNOSIS)
                    .orElseThrow(() -> new BusinessRuleException(
                            "Required explanatory diagnosis is not configured: "
                                    + SELECTED_RULES_FAILURE_DIAGNOSIS));
            concordance = 0;
        }
        return persistFinal(session, selectedDiagnosis, suggestedDiagnosis,
                finalCandidates, concordance, request.diagnosticoInicial());
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
        return prepareCandidates(loadInferenceContext(session));
        }

        private InferenceContext loadInferenceContext(Sesion session) {
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
        return new InferenceContext(
            diagnosisRepository.findAll().stream()
                .filter(diagnosis -> diagnosis.getEstado() != null
                    && activeStateId.equals(diagnosis.getEstado().getId()))
                .sorted((left, right) -> left.getId().compareTo(right.getId()))
                .toList(),
            ruleRepository.findRulesByDiagnosis(),
            ruleRepository.findCriterionReferencesByDiagnosis(),
            presentCriterionIds);
        }

            private List<Diagnostico> selectedFirstCandidate(
                Diagnostico selectedDiagnosis, InferenceContext context) {
        List<DiagnosticRuleEvaluator.Rule> selectedRules =
            context.rulesByDiagnosis().get(selectedDiagnosis.getId());
        if (selectedRules == null || selectedRules.isEmpty()) {
            return null;
        }
        DiagnosticRuleEvaluator.Result result = ruleEvaluator.evaluate(
            selectedRules,
            context.referencesByDiagnosis().getOrDefault(selectedDiagnosis.getId(), List.of()),
            context.presentCriterionIds());
        if (!result.supported()) {
            throw new BusinessRuleException(
                "Invalid inference rule for selected diagnosis: " + result.detail());
        }
        return result.satisfied() ? List.of(selectedDiagnosis) : null;
        }

        private PreparedCandidates prepareCandidates(InferenceContext context) {
        List<Diagnostico> activeDiagnoses = context.activeDiagnoses();
        Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis = context.rulesByDiagnosis();
        Map<Integer, List<DiagnosticRuleEvaluator.CriterionReference>> referencesByDiagnosis =
            context.referencesByDiagnosis();
        Set<Integer> presentCriterionIds = context.presentCriterionIds();
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

    private Diagnostico findActiveDiagnosis(Integer diagnosisId) {
        Diagnostico diagnosis = diagnosisRepository.findById(diagnosisId)
                .orElseThrow(() -> new ResourceNotFoundException("Diagnosis not found"));
        Integer activeStateId = supportService.getActiveState().getId();
        if (diagnosis.getEstado() == null || !activeStateId.equals(diagnosis.getEstado().getId())) {
            throw new BusinessRuleException("The selected diagnosis is inactive.");
        }
        return diagnosis;
    }

    private Map<Integer, Integer> parseAnswers(List<InferenceWorkflowDTO.Answer> submittedAnswers) {
        Map<Integer, Integer> answers = new LinkedHashMap<>();
        if (submittedAnswers == null) {
            return answers;
        }
        for (InferenceWorkflowDTO.Answer answer : submittedAnswers) {
            if (answer == null || answer.ruleId() == null || answer.value() == null
                    || (answer.value() != 0 && answer.value() != 1)
                    || answers.putIfAbsent(answer.ruleId(), answer.value()) != null) {
                throw new BusinessRuleException("Every exclusion question requires one explicit Sí/No answer.");
            }
        }
        return answers;
    }

    private void validateAnswerIds(Map<Integer, Integer> answers, Set<Integer> allowedRuleIds) {
        if (!allowedRuleIds.containsAll(answers.keySet())) {
            throw new BusinessRuleException("An answer was submitted for an unrequested exclusion question.");
        }
    }

    private Set<Integer> exclusionRuleIds(List<DiagnosticRuleEvaluator.Rule> rules) {
        Set<Integer> ruleIds = new LinkedHashSet<>();
        for (DiagnosticRuleEvaluator.Rule rule : rules) {
            if (!ruleEvaluator.isExclusionRule(rule)) {
                continue;
            }
            if (rule.ruleId() == null) {
                throw new BusinessRuleException("An exclusion rule is missing its identifier.");
            }
            ruleIds.add(rule.ruleId());
        }
        return ruleIds;
    }

    private void reuseSharedQuestionAnswers(
            Map<Integer, Integer> answers, List<Diagnostico> candidates,
            Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis,
            List<DiagnosticRuleEvaluator.Rule> selectedRules) {
        Map<String, Integer> answerByQuestion = new LinkedHashMap<>();
        collectAnswersByQuestion(answerByQuestion, selectedRules, answers);
        for (Diagnostico candidate : candidates) {
            collectAnswersByQuestion(answerByQuestion,
                    rulesByDiagnosis.getOrDefault(candidate.getId(), List.of()), answers);
        }
        for (Diagnostico candidate : candidates) {
            for (DiagnosticRuleEvaluator.Rule rule : rulesByDiagnosis.getOrDefault(candidate.getId(), List.of())) {
                if (ruleEvaluator.isExclusionRule(rule) && !answers.containsKey(rule.ruleId())
                        && answerByQuestion.containsKey(rule.parameter())) {
                    answers.put(rule.ruleId(), answerByQuestion.get(rule.parameter()));
                }
            }
        }
    }

    private void collectAnswersByQuestion(
            Map<String, Integer> answerByQuestion,
            List<DiagnosticRuleEvaluator.Rule> rules,
            Map<Integer, Integer> answers) {
        for (DiagnosticRuleEvaluator.Rule rule : rules) {
            if (ruleEvaluator.isExclusionRule(rule) && answers.containsKey(rule.ruleId())) {
                answerByQuestion.putIfAbsent(rule.parameter(), answers.get(rule.ruleId()));
            }
        }
    }

    private List<InferenceWorkflowDTO.Question> collectMissingQuestions(
            List<Diagnostico> candidates,
            Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis,
            Map<Integer, Integer> answers) {
        Map<String, QuestionAssociations> questions = new LinkedHashMap<>();
        for (Diagnostico candidate : candidates) {
            for (DiagnosticRuleEvaluator.Rule rule : rulesByDiagnosis.getOrDefault(candidate.getId(), List.of())) {
                if (!ruleEvaluator.isExclusionRule(rule) || answers.containsKey(rule.ruleId())) {
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
                        entry.getKey(), List.copyOf(entry.getValue().ruleIds()),
                        List.copyOf(entry.getValue().diagnosisIds())))
                .toList();
    }

    private InferenceWorkflowDTO.FinalResponse pendingResponse(
            List<Diagnostico> candidates,
            List<InferenceWorkflowDTO.Question> questions,
            Integer selectedDiagnosisId) {
        return new InferenceWorkflowDTO.FinalResponse(
                false, candidates.stream().map(this::toCandidate).toList(), questions,
                null, null, selectedDiagnosisId, null);
    }

    private InferenceWorkflowDTO.FinalResponse persistFinal(
            Sesion session, Diagnostico selectedDiagnosis, Diagnostico suggestedDiagnosis,
            List<Diagnostico> finalCandidates, Integer concordance, Boolean diagnosticoInicial) {
        PacienteDiagnosticoRequestDTO patientDiagnosisRequest = new PacienteDiagnosticoRequestDTO();
        patientDiagnosisRequest.setSesionId(session.getId());
        patientDiagnosisRequest.setDiagnosticoId(selectedDiagnosis.getId());
        patientDiagnosisRequest.setDiagnosticoInicial(diagnosticoInicial);
        patientDiagnosisService.create(patientDiagnosisRequest);

        EvaluacionDiagnostica evaluation = evaluationRepository
                .findBySesionIdOrderByFechaHoraInferenciaDesc(session.getId())
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
                true, finalCandidates.stream().map(this::toCandidate).toList(), List.of(),
                suggestedDiagnosis == null ? null : toCandidate(suggestedDiagnosis),
                suggestedDiagnosis == null ? null : suggestedDiagnosis.getId(),
                selectedDiagnosis.getId(), concordance);
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

            private record InferenceContext(
                List<Diagnostico> activeDiagnoses,
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