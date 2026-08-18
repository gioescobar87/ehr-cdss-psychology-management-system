import apiClient from "../../shared/api/apiClient";

import type { PsychologicalTest } from "../../catalog/types/psychologicalTest.types";
import type {
  SessionPsychologicalTest,
  SessionPsychologicalTestRequest,
} from "../types/sessionPsychologicalTest.types";

export async function getPsychologicalTests(): Promise<PsychologicalTest[]> {
  const response = await apiClient.get<PsychologicalTest[]>(
    "/prueba-psicologica",
  );

  return response.data;
}

export async function getPsychologicalTestById(
  id: number,
): Promise<PsychologicalTest> {
  const response = await apiClient.get<PsychologicalTest>(
    `/prueba-psicologica/${id}`,
  );

  return response.data;
}

export async function getSessionPsychologicalTests(
  sessionId: number,
): Promise<SessionPsychologicalTest[]> {
  const response = await apiClient.get<SessionPsychologicalTest[]>(
    `/sesion/${sessionId}/pruebas`,
  );

  return response.data;
}

export async function getPsychologicalTestApplicationById(
  id: number,
): Promise<SessionPsychologicalTest> {
  const response = await apiClient.get<SessionPsychologicalTest>(
    `/aplicacion-prueba/${id}`,
  );

  return response.data;
}

export async function createPsychologicalTestApplication(
  request: SessionPsychologicalTestRequest,
): Promise<SessionPsychologicalTest> {
  const response = await apiClient.post<SessionPsychologicalTest>(
    "/aplicacion-prueba",
    request,
  );

  return response.data;
}

export async function updatePsychologicalTestApplication(
  id: number,
  request: SessionPsychologicalTestRequest,
): Promise<SessionPsychologicalTest> {
  const response = await apiClient.put<SessionPsychologicalTest>(
    `/aplicacion-prueba/${id}`,
    request,
  );

  return response.data;
}

export async function deletePsychologicalTestApplication(
  id: number,
): Promise<void> {
  await apiClient.delete(`/aplicacion-prueba/${id}`);
}
