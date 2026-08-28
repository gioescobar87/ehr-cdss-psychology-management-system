import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createPsychologicalTestApplication,
  updatePsychologicalTestApplication,
} from "../api/sessionPsychologicalTestApi";

import { sessionPsychologicalTestQueryKeys } from "./useSessionPsychologicalTests";

import type { SessionPsychologicalTestRequest } from "../types/sessionPsychologicalTest.types";

interface UpdatePsychologicalTestApplicationVariables {
  id: number;
  request: SessionPsychologicalTestRequest;
  attachment?: File | null;
}

export function useCreatePsychologicalTestApplication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      request,
      attachment,
    }: {
      request: SessionPsychologicalTestRequest;
      attachment?: File | null;
    }) => createPsychologicalTestApplication(request, attachment),

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
      attachment,
    }: UpdatePsychologicalTestApplicationVariables) =>
      updatePsychologicalTestApplication(id, request, attachment),

    onSuccess: (application) => {
      queryClient.invalidateQueries({
        queryKey: sessionPsychologicalTestQueryKeys.bySession(
          application.sesionId,
        ),
      });
    },
  });
}
