import apiClient from "../../shared/api/apiClient";
import type { Response, Request, UsuarioRol } from "../types/usuario.types";

const BASE_PATH = "/usuarios";

export async function getAll(): Promise<Response[]> {
  const response = await apiClient.get<Response[]>(BASE_PATH);
  return response.data;
}

export async function getById(id: number): Promise<Response> {
  const response = await apiClient.get<Response>(`${BASE_PATH}/${id}`);
  return response.data;
}

export async function create(request: Request): Promise<Response> {
  const response = await apiClient.post<Response>(BASE_PATH, request);
  return response.data;
}

export async function update(id: number, request: Request): Promise<Response> {
  const response = await apiClient.put<Response>(`${BASE_PATH}/${id}`, request);
  return response.data;
}

export async function changeStatus(
  id: number,
  estadoId: number,
): Promise<void> {
  await apiClient.patch(`${BASE_PATH}/${id}/estado`, { estadoId });
}

export async function getRoles(usuarioId: number): Promise<UsuarioRol[]> {
  const response = await apiClient.get<UsuarioRol[]>(
    `${BASE_PATH}/${usuarioId}/roles`,
  );
  return response.data;
}

export async function assignRol(
  usuarioId: number,
  rolId: number,
): Promise<void> {
  await apiClient.post(`${BASE_PATH}/${usuarioId}/roles`, { rolId });
}

export async function removeRol(
  usuarioId: number,
  rolId: number,
): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${usuarioId}/roles/${rolId}`);
}
