import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSessionSymptom,
  createSessionSymptomsBatch,
  getClinicalCriteria,
  getPatientSymptoms,
  updateSessionSymptom,
} from "../api/sessionSymptomApi";
import type { SessionSymptomRequest } from "../types/sessionSymptom.types";

export function useClinicalCriteria(enabled = true) {
  return useQuery({
    queryKey: ["clinical-criteria"],
    queryFn: getClinicalCriteria,
    enabled,
  });
}

export function usePatientSymptoms(patientId: number) {
  return useQuery({
    queryKey: ["patient-symptoms", patientId],
    queryFn: () => getPatientSymptoms(patientId),
    enabled: patientId > 0,
  });
}

export function useCreateSessionSymptom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSessionSymptom,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-symptoms"],
      });
    },
  });
}

export function useCreateSessionSymptomsBatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createSessionSymptomsBatch,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patient-symptoms"] });
    },
  });
}

export function useUpdateSessionSymptom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: SessionSymptomRequest;
    }) => updateSessionSymptom(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["patient-symptoms"],
      });
    },
  });
}
