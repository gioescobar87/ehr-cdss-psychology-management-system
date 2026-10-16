package com.clinica.psicologia.system.support_services.expert_system;

import java.util.List;

public final class InferenceWorkflowDTO {

    private InferenceWorkflowDTO() {
    }

    public record Candidate(Integer diagnosisId, String diagnosis) {
    }

    public record Question(String question, List<Integer> ruleIds, List<Integer> diagnosisIds) {
    }

    public record PreparationResponse(List<Candidate> candidates, List<Question> questions) {
    }

    public record Answer(Integer ruleId, Integer value) {
    }

    public record FinalizeRequest(
            Integer diagnosticoSeleccionadoId,
            Boolean diagnosticoInicial,
            List<Answer> answers) {
    }

    public record FinalResponse(
            List<Candidate> candidates,
            Integer diagnosticoSugeridoId,
            Integer diagnosticoSeleccionadoId,
            Integer concordanciaDiagnostica) {
    }
}