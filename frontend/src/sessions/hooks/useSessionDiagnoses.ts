import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPatientDiagnosis,
  finalizeSessionInference,
  getDiagnoses,
  prepareSessionInference,
} from "../api/sessionDiagnosisApi";
import type {
  FinalizeInferenceRequest,
  PatientDiagnosisRequest,
} from "../types/sessionDiagnosis.types";

export function useDiagnoses(enabled = true) {
  return useQuery({
    queryKey: ["diagnoses"],
    queryFn: getDiagnoses,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreatePatientDiagnosis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PatientDiagnosisRequest) =>
      createPatientDiagnosis(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient"],
      });
      queryClient.invalidateQueries({
        queryKey: ["clinical-session-context"],
      });
    },
  });
}

export function usePrepareSessionInference() {
  return useMutation({
    mutationFn: ({
      sessionId,
      diagnosticoSeleccionadoId,
    }: {
      sessionId: number;
      diagnosticoSeleccionadoId: number;
    }) => prepareSessionInference(sessionId, diagnosticoSeleccionadoId),
  });
}

export function useFinalizeSessionInference() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      sessionId,
      request,
    }: {
      sessionId: number;
      request: FinalizeInferenceRequest;
    }) => finalizeSessionInference(sessionId, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient"] });
      queryClient.invalidateQueries({ queryKey: ["clinical-session-context"] });
    },
  });
}
