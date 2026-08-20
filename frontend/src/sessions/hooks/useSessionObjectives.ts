import { useQuery } from "@tanstack/react-query";

import {
  getObjectiveProgress,
  getPatientObjectives,
  getPatientTherapyObjectives,
} from "../api/sessionObjectiveApi";

export function usePatientTherapyObjectives(patientId: number, enabled = true) {
  return useQuery({
    queryKey: ["patient-therapy-objectives", patientId],
    queryFn: () => getPatientTherapyObjectives(patientId),
    enabled: enabled && patientId > 0,
  });
}

export function useObjectiveProgress(objectiveId: number, enabled = true) {
  return useQuery({
    queryKey: ["objective-progress", objectiveId],
    queryFn: () => getObjectiveProgress(objectiveId),
    enabled: enabled && objectiveId > 0,
  });
}

export function usePatientObjectives(pacienteId?: number) {
  return useQuery({
    queryKey: ["patient-objectives", pacienteId],
    queryFn: () => getPatientObjectives(pacienteId!),
    enabled: Boolean(pacienteId),
  });
}
