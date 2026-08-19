import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createSeguimientoObjetivo } from "../api/seguimientoObjetivoApi";

import type { SeguimientoObjetivoRequest } from "../types/seguimientoObjetivo.types";

export function useCreateSeguimientoObjetivo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SeguimientoObjetivoRequest) =>
      createSeguimientoObjetivo(request),

    onSuccess: (_data, request) => {
      queryClient.invalidateQueries({
        queryKey: ["patient-objectives"],
      });

      queryClient.invalidateQueries({
        queryKey: ["session-objective-progress"],
      });

      queryClient.invalidateQueries({
        queryKey: ["objective-progress", request.objetivoTerapiaId],
      });
    },
  });
}