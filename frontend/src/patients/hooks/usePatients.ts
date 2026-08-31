import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createPatient,
  getPatients,
  updatePatient,
  closePatientCase,
} from "../api/patientApi";
import type { PatientRequest } from "../types/patient.types";

export const patientKeys = {
  all: ["patients"] as const,
};

export function usePatients() {
  return useQuery({ queryKey: patientKeys.all, queryFn: getPatients });
}

export function useUpdatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: PatientRequest }) =>
      updatePatient(id, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPatient,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}

export function useClosePatientCase() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, motivoCierre }: { id: number; motivoCierre: string }) =>
      closePatientCase(id, motivoCierre),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: patientKeys.all });
    },
  });
}
