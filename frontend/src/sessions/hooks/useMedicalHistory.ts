import { useQuery } from "@tanstack/react-query";

import {
  getAllergies,
  getFamilyHistory,
  getMedicalHistory,
  getMedications,
} from "../api/medicalHistoryApi";

export function useMedicalHistory(patientId: number, enabled: boolean) {
  const options = { enabled: enabled && patientId > 0 };

  return {
    medical: useQuery({
      queryKey: ["medical-history", patientId],
      queryFn: () => getMedicalHistory(patientId),
      ...options,
    }),
    family: useQuery({
      queryKey: ["family-history", patientId],
      queryFn: () => getFamilyHistory(patientId),
      ...options,
    }),
    allergies: useQuery({
      queryKey: ["allergy-history", patientId],
      queryFn: () => getAllergies(patientId),
      ...options,
    }),
    medications: useQuery({
      queryKey: ["medication-history", patientId],
      queryFn: () => getMedications(patientId),
      ...options,
    }),
  };
}
