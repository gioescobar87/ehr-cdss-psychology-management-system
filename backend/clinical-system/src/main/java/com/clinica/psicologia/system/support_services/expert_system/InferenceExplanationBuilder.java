package com.clinica.psicologia.system.support_services.expert_system;

import java.util.List;

import org.springframework.stereotype.Service;

import com.clinica.psicologia.system.model.catalog.Diagnostico;

@Service
public class InferenceExplanationBuilder {

    public String build(List<InferenceStep> steps, Diagnostico diagnostico) {

        StringBuilder explanation = new StringBuilder();

        explanation.append("Diagnostic inference path\n");
        explanation.append("-------------------------\n\n");

        for (int i = 0; i < steps.size(); i++) {

            InferenceStep step = steps.get(i);

            explanation
                    .append(i + 1)
                    .append(". ")
                    .append(step.getCriterionCode())
                    .append(" - ")
                    .append(step.getCriterionName())
                    .append(" => ")
                    .append(step.isPresent() ? "PRESENT" : "ABSENT")
                    .append("\n");
        }

        explanation.append("\nFinal diagnosis: ")
                .append(diagnostico.getNombre());

        return explanation.toString();
    }
}