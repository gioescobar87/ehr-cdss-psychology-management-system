import apiClient from "../../shared/api/apiClient";

import type {
  SessionPsychologicalTest,
  SessionPsychologicalTestRequest,
} from "../types/sessionPsychologicalTest.types";

export async function getPsychologicalTestApplicationsBySession(
  sessionId: number,
): Promise<SessionPsychologicalTest[]> {
  const response = await apiClient.get<SessionPsychologicalTest[]>(
    `/aplicacion-prueba/sesion/${sessionId}`,
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
