import { useQuery } from "@tanstack/react-query";

import {
  getInterventionTypes,
  getInterventions,
  getSessionInterventions,
} from "../api/sessionInterventionApi";

export function useSessionInterventions(sessionId: number) {
  return useQuery({
    queryKey: ["session-interventions", sessionId],
    queryFn: () => getSessionInterventions(sessionId),
    enabled: sessionId > 0,
  });
}

export function useInterventionTypes(enabled = true) {
  return useQuery({
    queryKey: ["intervention-types"],
    queryFn: getInterventionTypes,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useInterventions(enabled = true) {
  return useQuery({
    queryKey: ["interventions"],
    queryFn: getInterventions,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
