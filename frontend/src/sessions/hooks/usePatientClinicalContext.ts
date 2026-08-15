import { useQuery } from "@tanstack/react-query";

import {
  getPatientDiagnoses,
  getPatientObjectives,
  getPatientRiskEvaluations,
  getPatientSessions,
} from "../api/sessionContextApi";

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
