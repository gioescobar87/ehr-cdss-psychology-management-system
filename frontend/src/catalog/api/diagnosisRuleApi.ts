import apiClient from "../../shared/api/apiClient";
import type {
  DiagnosticoRegla,
  DiagnosticoReglaRequest,
} from "../types/diagnosticCatalog.types";

const BASE_PATH = "/catalogos/diagnostico-regla";

export async function getAll(): Promise<DiagnosticoRegla[]> {
  const response = await apiClient.get<DiagnosticoRegla[]>(BASE_PATH);
  return response.data;
}

export async function getById(id: number): Promise<DiagnosticoRegla> {
  const response = await apiClient.get<DiagnosticoRegla>(`${BASE_PATH}/${id}`);
  return response.data;
}

export async function create(
  request: DiagnosticoReglaRequest,
): Promise<DiagnosticoRegla> {
  const response = await apiClient.post<DiagnosticoRegla>(BASE_PATH, request);
  return response.data;
}

export async function update(
  id: number,
  request: DiagnosticoReglaRequest,
): Promise<DiagnosticoRegla> {
  const response = await apiClient.put<DiagnosticoRegla>(
    `${BASE_PATH}/${id}`,
    request,
  );
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
