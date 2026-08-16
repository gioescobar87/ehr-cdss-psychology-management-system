import apiClient from "../../shared/api/apiClient";

import type {
  Intervention,
  InterventionType,
  SessionIntervention,
  SessionInterventionRequest,
} from "../types/sessionIntervention.types";

export async function getSessionInterventions(
  sessionId: number,
): Promise<SessionIntervention[]> {
  const response = await apiClient.get<SessionIntervention[]>(
    `/sesion/${sessionId}/sesiones-intervencion`,
  );

  return response.data;
}

export async function createSessionIntervention(
  request: SessionInterventionRequest,
): Promise<SessionIntervention> {
  const response = await apiClient.post<SessionIntervention>(
    "/sesion-intervencion",
    request,
  );

  return response.data;
}

export async function deleteSessionIntervention(id: number): Promise<void> {
  await apiClient.delete(`/sesion-intervencion/${id}`);
}

export async function getInterventionTypes(): Promise<InterventionType[]> {
  const response = await apiClient.get<InterventionType[]>(
    "/catalogos/tipo-intervencion",
  );

  return response.data;
}

export async function getInterventions(): Promise<Intervention[]> {
  const response = await apiClient.get<Intervention[]>("/intervencion");

  return response.data;
}
