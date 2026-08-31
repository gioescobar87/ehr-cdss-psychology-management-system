import { useQuery } from "@tanstack/react-query";

import { getUserSessions } from "../api/sessionApi";

export function useUserSessions(usuarioId?: number) {
  return useQuery({
    queryKey: ["user-sessions", usuarioId],
    queryFn: () => getUserSessions(usuarioId!),
    enabled: usuarioId !== undefined,
  });
}
