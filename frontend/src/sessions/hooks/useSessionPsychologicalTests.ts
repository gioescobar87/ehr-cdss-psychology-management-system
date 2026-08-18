import { useQuery } from "@tanstack/react-query";

import {
  getPsychologicalTests,
  getSessionPsychologicalTests,
} from "../api/sessionPsychologicalTestApi";

export function useSessionPsychologicalTests(sessionId: number) {
  return useQuery({
    queryKey: ["session-psychological-tests", sessionId],
    queryFn: () => getSessionPsychologicalTests(sessionId),
    enabled: sessionId > 0,
  });
}

export function usePsychologicalTests(enabled = true) {
  return useQuery({
    queryKey: ["psychological-tests"],
    queryFn: getPsychologicalTests,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
