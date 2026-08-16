import { useQuery } from "@tanstack/react-query";

import {
  getPatientRiskEvaluations,
  getRiskLevels,
  getRiskTypes,
  getSessionRiskEvaluations,
} from "../api/sessionRiskEvaluationApi";

export function useSessionRiskEvaluations(sessionId: number) {
  return useQuery({
    queryKey: ["session-risk-evaluations", sessionId],
    queryFn: () => getSessionRiskEvaluations(sessionId),
    enabled: sessionId > 0,
  });
}

export function usePatientRiskEvaluations(patientId: number) {
  return useQuery({
    queryKey: ["patient-risk-evaluations", patientId],
    queryFn: () => getPatientRiskEvaluations(patientId),
    enabled: patientId > 0,
  });
}

export function useRiskTypes(enabled = true) {
  return useQuery({
    queryKey: ["risk-types"],
    queryFn: getRiskTypes,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRiskLevels(enabled = true) {
  return useQuery({
    queryKey: ["risk-levels"],
    queryFn: getRiskLevels,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
