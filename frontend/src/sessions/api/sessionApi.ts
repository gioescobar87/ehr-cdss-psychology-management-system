import apiClient from "../../shared/api/apiClient";

import type {
  Sesion,
  SessionRequest,
  //SessionType,
} from "../types/session.types";

export async function createSession(request: SessionRequest): Promise<Sesion> {
  const response = await apiClient.post<Sesion>("/sesion", request);
  return response.data;
}

export async function getSessions(): Promise<Sesion[]> {
  const response = await apiClient.get<Sesion[]>("/sesion");
  return response.data;
}

export async function getSessionById(id: number): Promise<Sesion> {
  const response = await apiClient.get<Sesion>(`/sesion/${id}`);
  return response.data;
}

export async function updateSession(
  id: number,
  request: SessionRequest,
): Promise<Sesion> {
  const response = await apiClient.put<Sesion>(`/sesion/${id}`, request);
  return response.data;
}

export async function deleteSession(id: number): Promise<void> {
  await apiClient.delete(`/sesion/${id}`);
}
