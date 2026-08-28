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
  attachment?: File | null,
): Promise<SessionPsychologicalTest> {
  const formData = createApplicationFormData(request, attachment);

  const response = await apiClient.post<SessionPsychologicalTest>(
    "/aplicacion-prueba",
    formData,
  );

  return response.data;
}

export async function updatePsychologicalTestApplication(
  id: number,
  request: SessionPsychologicalTestRequest,
  attachment?: File | null,
): Promise<SessionPsychologicalTest> {
  const formData = createApplicationFormData(request, attachment);

  const response = await apiClient.put<SessionPsychologicalTest>(
    `/aplicacion-prueba/${id}`,
    formData,
  );

  return response.data;
}

function createApplicationFormData(
  request: SessionPsychologicalTestRequest,
  attachment?: File | null,
): FormData {
  const formData = new FormData();

  formData.append(
    "request",
    new Blob([JSON.stringify(request)], { type: "application/json" }),
  );

  if (attachment) {
    formData.append("attachment", attachment, attachment.name);
  }

  return formData;
}

export async function getPsychologicalTestApplicationAttachment(
  id: number,
): Promise<Blob> {
  const response = await apiClient.get<Blob>(
    `/aplicacion-prueba/${id}/archivo`,
    {
      responseType: "blob",
    },
  );
  return response.data;
}
