import apiClient from "../../shared/api/apiClient";

import type {
  ObjetivoTerapia,
  SeguimientoObjetivo,
  SeguimientoObjetivoRequest,
} from "../types/sessionObjective.types";

export async function getPatientTherapyObjectives(
  patientId: number,
): Promise<ObjetivoTerapia[]> {
  const response = await apiClient.get<ObjetivoTerapia[]>(
    `/paciente/${patientId}/objetivos`,
  );

  return response.data;
}

export async function getObjectiveProgress(
  objectiveId: number,
): Promise<SeguimientoObjetivo[]> {
  const response = await apiClient.get<SeguimientoObjetivo[]>(
    `/objetivo-terapia/${objectiveId}/seguimientos`,
  );

  return response.data;
}

export async function createObjectiveProgress(
  request: SeguimientoObjetivoRequest,
): Promise<SeguimientoObjetivo> {
  const response = await apiClient.post<SeguimientoObjetivo>(
    "/seguimiento-objetivo",
    request,
  );

  return response.data;
}

export async function updateObjectiveProgress(
  id: number,
  request: SeguimientoObjetivoRequest,
): Promise<SeguimientoObjetivo> {
  const response = await apiClient.put<SeguimientoObjetivo>(
    `/seguimiento-objetivo/${id}`,
    request,
  );

  return response.data;
}

export async function deleteObjectiveProgress(
  id: number,
): Promise<void> {
  await apiClient.delete(`/seguimiento-objetivo/${id}`);
}

export async function getPatientObjectives(
  pacienteId: number,
): Promise<ObjetivoTerapia[]> {
  const response = await apiClient.get<ObjetivoTerapia[]>(
    `/paciente/${pacienteId}/objetivos`,
  );

  return response.data;
}