import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPatientDiagnosis,
  getDiagnoses,
} from "../api/sessionDiagnosisApi";
import type { PatientDiagnosisRequest } from "../types/sessionDiagnosis.types";

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
