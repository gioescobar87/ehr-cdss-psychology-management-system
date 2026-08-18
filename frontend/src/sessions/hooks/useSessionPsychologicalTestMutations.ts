import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPsychologicalTestApplication,
  deletePsychologicalTestApplication,
  updatePsychologicalTestApplication,
} from "../api/sessionPsychologicalTestApi";

import type { SessionPsychologicalTestRequest } from "../types/sessionPsychologicalTest.types";

export function useCreatePsychologicalTestApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SessionPsychologicalTestRequest) =>
      createPsychologicalTestApplication(request),

    onSuccess: (_, request) => {
      queryClient.invalidateQueries({
        queryKey: ["session-psychological-tests", request.sesionId],
      });
    },
  });
}

export function useUpdatePsychologicalTestApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: SessionPsychologicalTestRequest;
    }) => updatePsychologicalTestApplication(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-psychological-tests", variables.request.sesionId],
      });

      queryClient.invalidateQueries({
        queryKey: ["psychological-test-application", variables.id],
      });
    },
  });
}

export function useDeletePsychologicalTestApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: number; sessionId: number }) =>
      deletePsychologicalTestApplication(id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["session-psychological-tests", variables.sessionId],
      });

      queryClient.removeQueries({
        queryKey: ["psychological-test-application", variables.id],
      });
    },
  });
}
