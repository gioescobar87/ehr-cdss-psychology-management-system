import { useMutation } from "@tanstack/react-query";

import { createSession } from "../api/sessionApi";

import type { Sesion, SessionRequest } from "../types/session.types";

export function useStartSession() {
  return useMutation<Sesion, Error, SessionRequest>({
    mutationFn: createSession,
  });
}
