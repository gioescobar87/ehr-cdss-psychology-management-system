import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createSessionNote,
  getPatientDiagnoses,
  getPatientObjectives,
  getPatientRiskEvaluations,
  getPatientSessions,
  getSessionNotes,
  getClinicalSessionContext,
} from "../api/sessionContextApi";
import type { SessionNoteRequest } from "../types/sessionContext.types";

export function useClinicalSessionContext(sessionId?: number) {
  return useQuery({
    queryKey: ["clinical-session-context", sessionId],
    queryFn: () => getClinicalSessionContext(sessionId!),
    enabled: sessionId !== undefined,
  });
}

export function usePatientSessions(patientId?: number) {
  return useQuery({
    queryKey: ["patient", patientId, "sessions"],
    queryFn: () => getPatientSessions(patientId!),
    enabled: patientId !== undefined,
  });
}

export function usePatientDiagnoses(patientId?: number) {
  return useQuery({
    queryKey: ["patient", patientId, "diagnoses"],
    queryFn: () => getPatientDiagnoses(patientId!),
    enabled: patientId !== undefined,
  });
}

export function usePatientObjectives(patientId?: number) {
  return useQuery({
    queryKey: ["patient", patientId, "objectives"],
    queryFn: () => getPatientObjectives(patientId!),
    enabled: patientId !== undefined,
  });
}

export function usePatientRiskEvaluations(patientId?: number) {
  return useQuery({
    queryKey: ["patient", patientId, "risk-evaluations"],
    queryFn: () => getPatientRiskEvaluations(patientId!),
    enabled: patientId !== undefined,
  });
}

export function useSessionNotes(sessionId: number | undefined) {
  return useQuery({
    queryKey: ["session-notes", sessionId],
    queryFn: () => getSessionNotes(sessionId!),
    enabled: sessionId !== undefined,
  });
}

export function useCreateSessionNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SessionNoteRequest) => createSessionNote(request),

    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ["session-notes", note.sesionId],
      });
    },
  });
}
