import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSession } from "../api/sessionApi";
import type { SessionRequest } from "../types/session.types";

export function useCreateSesion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SessionRequest) => createSession(request),
    onSuccess: (sesion) => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      queryClient.setQueryData(["session", sesion.id], sesion);
    },
  });
}
