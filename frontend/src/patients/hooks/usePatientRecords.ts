import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAllergy,
  createFamilyHistory,
  createMedicalHistory,
  createMedication,
  deactivateAllergy,
  deactivateMedicalHistory,
  deactivateMedication,
} from "../api/patientRecordApi";
import type {
  AllergyRequest,
  FamilyHistoryRequest,
  MedicalHistoryRequest,
  MedicationRequest,
} from "../api/patientRecordApi";
import { updatePatientHistory } from "../api/patientRecordApi";
import type { PatientHistoryRequest } from "../types/patientHistory.types";

function useInvalidatePatientRecord() {
  const queryClient = useQueryClient();
  return (patientId: number) => {
    void queryClient.invalidateQueries({
      queryKey: ["medical-history", patientId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["family-history", patientId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["allergy-history", patientId],
    });
    void queryClient.invalidateQueries({
      queryKey: ["medication-history", patientId],
    });
  };
}

export function useCreateMedicalHistory() {
  const invalidate = useInvalidatePatientRecord();
  return useMutation({
    mutationFn: (request: MedicalHistoryRequest) =>
      createMedicalHistory(request),
    onSuccess: (_, request) => invalidate(request.pacienteId),
  });
}

export function useUpdatePatientHistory() {
  const invalidate = useInvalidatePatientRecord();
  return useMutation({
    mutationFn: ({
      patientId,
      request,
    }: {
      patientId: number;
      request: PatientHistoryRequest;
    }) => updatePatientHistory(patientId, request),
    onSuccess: (_, variables) => invalidate(variables.patientId),
  });
}
export function useCreateFamilyHistory() {
  const invalidate = useInvalidatePatientRecord();
  return useMutation({
    mutationFn: (request: FamilyHistoryRequest) => createFamilyHistory(request),
    onSuccess: (_, request) => invalidate(request.pacienteId),
  });
}
export function useCreateAllergy() {
  const invalidate = useInvalidatePatientRecord();
  return useMutation({
    mutationFn: (request: AllergyRequest) => createAllergy(request),
    onSuccess: (_, request) => invalidate(request.pacienteId),
  });
}
export function useCreateMedication() {
  const invalidate = useInvalidatePatientRecord();
  return useMutation({
    mutationFn: (request: MedicationRequest) => createMedication(request),
    onSuccess: (_, request) => invalidate(request.pacienteId),
  });
}

function useDeactivateRecord(mutation: (id: number) => Promise<unknown>) {
  const invalidate = useInvalidatePatientRecord();
  return useMutation({
    mutationFn: ({ id }: { id: number; patientId: number }) => mutation(id),
    onSuccess: (_, variables) => invalidate(variables.patientId),
  });
}
export function useDeactivateMedicalHistory() {
  return useDeactivateRecord(deactivateMedicalHistory);
}
export function useDeactivateAllergy() {
  return useDeactivateRecord(deactivateAllergy);
}
export function useDeactivateMedication() {
  return useDeactivateRecord(deactivateMedication);
}
