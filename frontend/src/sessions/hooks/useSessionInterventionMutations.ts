import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createSessionIntervention,
  deleteSessionIntervention,
} from "../api/sessionInterventionApi";

import type { SessionInterventionRequest } from "../types/sessionIntervention.types";

export function useCreateSessionIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SessionInterventionRequest) =>
      createSessionIntervention(request),

    onSuccess: (_, request) => {
      queryClient.invalidateQueries({
        queryKey: ["session-interventions", request.sesionId],
      });
    },
  });
}

export function useDeleteSessionIntervention() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: { id: number; sessionId: number }) =>
      deleteSessionIntervention(variables.id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-interventions", variables.sessionId],
      });
    },
  });
}
