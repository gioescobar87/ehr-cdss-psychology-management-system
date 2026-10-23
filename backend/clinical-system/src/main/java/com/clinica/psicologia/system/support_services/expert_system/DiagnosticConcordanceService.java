package com.clinica.psicologia.system.support_services.expert_system;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.catalog.Diagnostico;
import com.clinica.psicologia.system.model.expert_system.EvaluacionDiagnostica;
import com.clinica.psicologia.system.repository.clinical.SesionCriterioClinicoRepository;
import com.clinica.psicologia.system.repository.expert_system.InferenceRuleRepository;
import com.clinica.psicologia.system.security.exception.custom.BusinessRuleException;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DiagnosticConcordanceService {

    private static final String MISSING_DIAGNOSIS_EXPLANATION =
            "No es posible determinar la concordancia porque falta el diagnóstico sugerido.";
    private static final String MATCHING_DIAGNOSES_EXPLANATION = "Diagnósticos coinciden";

    private final SesionCriterioClinicoRepository sessionCriteriaRepository;
    private final InferenceRuleRepository ruleRepository;
    private final DiagnosticRuleEvaluator ruleEvaluator;

    public Integer update(EvaluacionDiagnostica evaluation) {
        return update(evaluation, Map.of(), null);
    }

    public Integer update(EvaluacionDiagnostica evaluation, Map<Integer, Integer> exclusionAnswers) {
        return update(evaluation, exclusionAnswers, null);
    }

    public Integer update(
            EvaluacionDiagnostica evaluation,
            Map<Integer, Integer> exclusionAnswers,
            Set<Integer> inferredPresentCriterionIds) {
        Diagnostico suggested = evaluation.getDiagnosticoSugerido();
        Diagnostico selected = evaluation.getDiagnosticoSeleccionado();

        if (suggested == null || selected == null) {
            evaluation.setConcordanciaDiagnostica(null);
            evaluation.setObservacion(MISSING_DIAGNOSIS_EXPLANATION);
            return null;
        }
        if (suggested.getId().equals(selected.getId())) {
            evaluation.setConcordanciaDiagnostica(1);
            evaluation.setObservacion(MATCHING_DIAGNOSES_EXPLANATION);
            return 1;
        }

        evaluation.setConcordanciaDiagnostica(0);
        evaluation.setObservacion(buildMismatchExplanation(
                evaluation, suggested, selected, exclusionAnswers, inferredPresentCriterionIds));
        return 0;
    }

    private String buildMismatchExplanation(
            EvaluacionDiagnostica evaluation,
            Diagnostico suggested,
            Diagnostico selected,
            Map<Integer, Integer> exclusionAnswers,
            Set<Integer> inferredPresentCriterionIds) {
        Integer selectedId = selected.getId();
        List<DiagnosticRuleEvaluator.Rule> rules = ruleRepository.findRulesByDiagnosis()
                .getOrDefault(selectedId, List.of());
        if (rules.isEmpty()) {
            return "El diagnóstico sugerido «" + suggested.getNombre()
                    + "» no coincide con el diagnóstico seleccionado «" + selected.getNombre()
                    + "», que no tiene reglas de inferencia configuradas.";
        }

        Set<Integer> presentCriterionIds = inferredPresentCriterionIds != null
                ? inferredPresentCriterionIds
                : sessionCriteriaRepository.findBySesionIdOrderByIdAsc(evaluation.getSesion().getId())
                        .stream()
                        .filter(criteria -> Boolean.TRUE.equals(criteria.getPresente()))
                        .map(criteria -> criteria.getCriterioClinico().getId())
                        .collect(Collectors.toSet());
        List<DiagnosticRuleEvaluator.CriterionReference> references = ruleRepository
                .findCriterionReferencesByDiagnosis()
                .getOrDefault(selectedId, List.of());

        List<String> missedRules = rules.stream()
                .map(rule -> describeMissedRule(rule, references, presentCriterionIds, exclusionAnswers))
                .flatMap(java.util.Optional::stream)
                .toList();
        String rulesExplanation = missedRules.isEmpty()
                ? "no se identificaron reglas incumplidas entre las reglas evaluables del diagnóstico seleccionado"
                : "no cumplió estas reglas: " + String.join("; ", missedRules);
        return "El diagnóstico sugerido «" + suggested.getNombre()
                + "» no coincide con el diagnóstico seleccionado «" + selected.getNombre()
                + "»; el diagnóstico seleccionado " + rulesExplanation + ".";
    }

    private java.util.Optional<String> describeMissedRule(
            DiagnosticRuleEvaluator.Rule rule,
            List<DiagnosticRuleEvaluator.CriterionReference> references,
            Set<Integer> presentCriterionIds,
            Map<Integer, Integer> exclusionAnswers) {
        if (ruleEvaluator.isBasicRule(rule)) {
            DiagnosticRuleEvaluator.Result result = ruleEvaluator.evaluate(List.of(rule), references,
                    presentCriterionIds);
            if (!result.supported()) {
                throw new BusinessRuleException("Invalid inference rule: " + result.detail());
            }
            if (result.satisfied()) {
                return java.util.Optional.empty();
            }

            long presentCount = references.stream()
                    .filter(reference -> reference != null && rule.parameter().equals(reference.reference()))
                    .map(DiagnosticRuleEvaluator.CriterionReference::criterionId)
                    .filter(id -> id != null && presentCriterionIds.contains(id))
                    .distinct()
                    .count();
            return java.util.Optional.of("la regla básica " + rule.parameter()
                    + " requería que el número de criterios fuera "
                    + comparisonDescription(rule.operator()) + " " + rule.value()
                    + "; se " + (presentCount == 1 ? "observó " : "observaron ")
                    + presentCount + " " + criterionCountWord(presentCount));
        }

        if (ruleEvaluator.isExclusionRule(rule)) {
            Integer answer = rule.ruleId() == null ? null : exclusionAnswers.get(rule.ruleId());
            if (answer == null) {
                return java.util.Optional.empty();
            }
            DiagnosticRuleEvaluator.Result result = ruleEvaluator.evaluateExclusion(rule, answer);
            if (!result.supported()) {
                throw new BusinessRuleException("Invalid inference rule: " + result.detail());
            }
            if (result.satisfied()) {
                return java.util.Optional.empty();
            }
            return java.util.Optional.of("la regla de exclusión «" + rule.parameter()
                    + "» no se cumplió con la respuesta «" + (answer == 1 ? "Sí" : "No")
                    + "» (la respuesta debía ser " + comparisonDescription(rule.operator())
                    + " " + rule.value() + ")");
        }

        DiagnosticRuleEvaluator.Result result = ruleEvaluator.evaluate(List.of(rule), references,
                presentCriterionIds);
        if (!result.supported()) {
            throw new BusinessRuleException("Invalid inference rule: " + result.detail());
        }
        return java.util.Optional.empty();
    }

    private String comparisonDescription(String operator) {
        return switch (operator) {
            case "=" -> "igual a";
            case ">" -> "mayor que";
            case "<" -> "menor que";
            default -> throw new BusinessRuleException("Unsupported inference-rule operator: " + operator);
        };
    }

    private String criterionCountWord(long count) {
        return count == 1 ? "criterio" : "criterios";
    }
}
