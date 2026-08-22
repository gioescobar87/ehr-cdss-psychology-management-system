import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import {
  createPsychologicalTestApplication,
  updatePsychologicalTestApplication,
} from "../api/sessionPsychologicalTestApi";

import {
  sessionPsychologicalTestQueryKeys,
} from "./useSessionPsychologicalTests";

import type {
  SessionPsychologicalTestRequest,
} from "../types/sessionPsychologicalTest.types";

interface UpdatePsychologicalTestApplicationVariables {
  id: number;
  request: SessionPsychologicalTestRequest;
}

export function useCreatePsychologicalTestApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SessionPsychologicalTestRequest) =>
      createPsychologicalTestApplication(request),

    onSuccess: (application) => {
      queryClient.invalidateQueries({
        queryKey: sessionPsychologicalTestQueryKeys.bySession(
          application.sesionId,
        ),
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
    }: UpdatePsychologicalTestApplicationVariables) =>
      updatePsychologicalTestApplication(id, request),

    onSuccess: (application) => {
      queryClient.invalidateQueries({
        queryKey: sessionPsychologicalTestQueryKeys.bySession(
          application.sesionId,
        ),
      });
    },
  });
}