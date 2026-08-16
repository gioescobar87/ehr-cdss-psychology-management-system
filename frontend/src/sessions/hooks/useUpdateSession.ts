import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateSession } from "../api/sessionApi";
import type { SessionRequest } from "../types/session.types";

export function useUpdateSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: SessionRequest;
    }) => updateSession(id, request),

    onSuccess: (session) => {
      queryClient.setQueryData(["session", session.id], session);
    },
  });
}