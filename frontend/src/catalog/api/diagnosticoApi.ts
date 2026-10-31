import apiClient from "../../shared/api/apiClient";
import type {
  Diagnostico,
  DiagnosticoRequest,
} from "../types/diagnosisCatalog.types";

const BASE_PATH = "/catalogos/diagnostico";

export async function getAll(): Promise<Diagnostico[]> {
  const response = await apiClient.get<Diagnostico[]>(BASE_PATH);
  return response.data;
}

export async function getById(id: number): Promise<Diagnostico> {
  const response = await apiClient.get<Diagnostico>(`${BASE_PATH}/${id}`);
  return response.data;
}

export async function create(
  request: DiagnosticoRequest,
): Promise<Diagnostico> {
  const response = await apiClient.post<Diagnostico>(BASE_PATH, request);
  return response.data;
}

export async function update(
  id: number,
  request: DiagnosticoRequest,
): Promise<Diagnostico> {
  const response = await apiClient.put<Diagnostico>(
    `${BASE_PATH}/${id}`,
    request,
  );
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
