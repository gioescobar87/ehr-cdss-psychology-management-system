import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createObjectiveProgress,
  deleteObjectiveProgress,
  updateObjectiveProgress,
} from "../api/sessionObjectiveApi";

import type { SeguimientoObjetivoRequest } from "../types/sessionObjective.types";

export function useCreateObjectiveProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SeguimientoObjetivoRequest) =>
      createObjectiveProgress(request),

    onSuccess: (_, request) => {
      queryClient.invalidateQueries({
        queryKey: ["objective-progress", request.objetivoTerapiaId],
      });
    },
  });
}

export function useUpdateObjectiveProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: SeguimientoObjetivoRequest;
    }) => updateObjectiveProgress(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["objective-progress", variables.request.objetivoTerapiaId],
      });
    },
  });
}

interface DeleteObjectiveProgressVariables {
  id: number;
  objectiveId: number;
}

export function useDeleteObjectiveProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (variables: DeleteObjectiveProgressVariables) =>
      deleteObjectiveProgress(variables.id),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["objective-progress", variables.objectiveId],
      });
    },
  });
}
