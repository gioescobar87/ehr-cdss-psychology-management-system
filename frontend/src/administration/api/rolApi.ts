import apiClient from "../../shared/api/apiClient";
import type {
  Response,
  Request,
  RolPermiso,
  RolOpcion,
  RolOpcionRequest,
} from "../types/rol.types";

const BASE_PATH = "/roles";

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

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}

export async function getPermisos(rolId: number): Promise<RolPermiso[]> {
  const response = await apiClient.get<RolPermiso[]>(
    `${BASE_PATH}/${rolId}/permisos`,
  );
  return response.data;
}

export async function assignPermiso(
  rolId: number,
  permisoId: number,
): Promise<void> {
  await apiClient.post(`${BASE_PATH}/${rolId}/permisos`, { permisoId });
}

export async function removePermiso(
  rolId: number,
  permisoId: number,
): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${rolId}/permisos/${permisoId}`);
}

export async function getOpciones(rolId: number): Promise<RolOpcion[]> {
  const response = await apiClient.get<RolOpcion[]>(
    `${BASE_PATH}/${rolId}/opciones`,
  );
  return response.data;
}

export async function assignOpcion(
  rolId: number,
  request: RolOpcionRequest,
): Promise<RolOpcion> {
  const response = await apiClient.post<RolOpcion>(
    `${BASE_PATH}/${rolId}/opciones`,
    request,
  );
  return response.data;
}

export async function removeOpcion(
  rolId: number,
  opcionId: number,
): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${rolId}/opciones/${opcionId}`);
}
