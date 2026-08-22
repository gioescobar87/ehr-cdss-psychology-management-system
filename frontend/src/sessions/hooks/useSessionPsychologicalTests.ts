import { useQuery } from "@tanstack/react-query";

import { getPsychologicalTestApplicationsBySession } from "../api/sessionPsychologicalTestApi";

import { getPsychologicalTests } from "../../catalog/api/psychologicalTestApi";

export const sessionPsychologicalTestQueryKeys = {
  all: ["session-psychological-tests"] as const,

  bySession: (sessionId: number) =>
    ["session-psychological-tests", "session", sessionId] as const,
};

export const psychologicalTestQueryKeys = {
  all: ["psychological-tests"] as const,
};

export function useSessionPsychologicalTests(sessionId: number) {
  return useQuery({
    queryKey: sessionPsychologicalTestQueryKeys.bySession(sessionId),
    queryFn: () => getPsychologicalTestApplicationsBySession(sessionId),
    enabled: sessionId > 0,
  });
}

export function usePsychologicalTests(enabled = true) {
  return useQuery({
    queryKey: psychologicalTestQueryKeys.all,
    queryFn: getPsychologicalTests,
    enabled,
  });
}
