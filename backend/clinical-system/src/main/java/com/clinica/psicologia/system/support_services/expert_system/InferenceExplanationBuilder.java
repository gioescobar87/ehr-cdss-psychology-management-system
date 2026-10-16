package com.clinica.psicologia.system.support_services.expert_system;

import org.springframework.stereotype.Service;

@Service
public class InferenceExplanationBuilder {

    public String build(DiagnosticInferenceEvaluator.Outcome outcome) {

        StringBuilder explanation = new StringBuilder();

        explanation.append("Clinical decision support suggestion (not a confirmed diagnosis): ")
                .append(outcome.status());
        for (String detail : outcome.details()) {
            explanation.append("\n- ").append(detail);
        }

        return explanation.toString();
    }
}