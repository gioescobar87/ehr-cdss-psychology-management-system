import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createRiskEvaluation,
  deleteRiskEvaluation,
  updateRiskEvaluation,
} from "../api/sessionRiskEvaluationApi";

import type { RiskEvaluationRequest } from "../types/sessionRiskEvaluation.types";

export function useCreateRiskEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: RiskEvaluationRequest) =>
      createRiskEvaluation(request),

    onSuccess: (_, request) => {
      queryClient.invalidateQueries({
        queryKey: ["session-risk-evaluations", request.sesionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-risk-evaluations", request.pacienteId],
      });
    },
  });
}

export function useUpdateRiskEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: RiskEvaluationRequest;
    }) => updateRiskEvaluation(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-risk-evaluations", variables.request.sesionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-risk-evaluations", variables.request.pacienteId],
      });
    },
  });
}

export function useDeleteRiskEvaluation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: {
      id: number;
      sessionId: number;
      patientId: number;
    }) => deleteRiskEvaluation(variables.id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-risk-evaluations", variables.sessionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["patient-risk-evaluations", variables.patientId],
      });
    },
  });
}
