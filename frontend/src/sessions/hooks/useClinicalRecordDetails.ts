import { useQuery } from "@tanstack/react-query";

import {
  getRiskEvaluationById,
} from "../api/sessionRiskEvaluationApi";

import {
  getPsychologicalTestApplicationById,
} from "../api/sessionPsychologicalTestApi";

import { getSessionById } from "../api/sessionApi";

export function useHistoricalSession(sessionId: number | null) {
  return useQuery({
    queryKey: ["historical-session", sessionId],
    queryFn: () => getSessionById(sessionId!),
    enabled: sessionId !== null,
  });
}

export function useHistoricalRiskEvaluation(
  evaluationId: number | null,
) {
  return useQuery({
    queryKey: ["historical-risk-evaluation", evaluationId],
    queryFn: () => getRiskEvaluationById(evaluationId!),
    enabled: evaluationId !== null,
  });
}

export function useHistoricalPsychologicalTest(
  applicationId: number | null,
) {
  return useQuery({
    queryKey: [
      "historical-psychological-test",
      applicationId,
    ],
    queryFn: () =>
      getPsychologicalTestApplicationById(applicationId!),
    enabled: applicationId !== null,
  });
}