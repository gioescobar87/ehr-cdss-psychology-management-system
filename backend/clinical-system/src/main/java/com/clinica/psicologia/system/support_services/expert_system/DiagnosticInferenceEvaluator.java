package com.clinica.psicologia.system.support_services.expert_system;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Component;

import com.clinica.psicologia.system.model.catalog.Diagnostico;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DiagnosticInferenceEvaluator {

    private final DiagnosticRuleEvaluator ruleEvaluator;

    public Outcome infer(
            List<Diagnostico> diagnoses,
            Map<Integer, List<DiagnosticRuleEvaluator.Rule>> rulesByDiagnosis,
            Map<Integer, List<DiagnosticRuleEvaluator.CriterionReference>> referencesByDiagnosis,
            Set<Integer> presentCriterionIds) {

        List<Diagnostico> matches = new ArrayList<>();
        List<String> details = new ArrayList<>();

        diagnoses.stream()
                .sorted(Comparator.comparing(Diagnostico::getId))
                .forEach(diagnosis -> {
                    Integer diagnosisId = diagnosis.getId();
                    DiagnosticRuleEvaluator.Result result = ruleEvaluator.evaluate(
                            rulesByDiagnosis.get(diagnosisId),
                            referencesByDiagnosis.getOrDefault(diagnosisId, List.of()),
                            presentCriterionIds);
                    details.add(diagnosis.getNombre() + ": " + result.detail());
                    if (result.supported() && result.satisfied()) {
                        matches.add(diagnosis);
                    }
                });

        if (matches.size() == 1) {
            return new Outcome(matches.getFirst(),
                    "One diagnosis satisfied all supported rules.", List.copyOf(details));
        }
        if (matches.size() > 1) {
            String names = matches.stream().map(Diagnostico::getNombre)
                    .reduce((left, right) -> left + ", " + right).orElse("");
            return new Outcome(null, "Ambiguous inference: multiple diagnoses qualified (" + names + ").",
                    List.copyOf(details));
        }
        return new Outcome(null, "No diagnosis satisfied the supported rules.", List.copyOf(details));
    }

    public record Outcome(Diagnostico suggestedDiagnosis, String status, List<String> details) {
    }
}