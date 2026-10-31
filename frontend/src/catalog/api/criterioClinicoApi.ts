import apiClient from "../../shared/api/apiClient";
import type {
  CriterioClinico,
  CriterioClinicoRequest,
} from "../types/clinicalCriterionCatalog.types";

const BASE_PATH = "/catalogos/criterio-clinico";

export async function getAll(): Promise<CriterioClinico[]> {
  const response = await apiClient.get<CriterioClinico[]>(BASE_PATH);
  return response.data;
}

export async function getById(id: number): Promise<CriterioClinico> {
  const response = await apiClient.get<CriterioClinico>(`${BASE_PATH}/${id}`);
  return response.data;
}

export async function create(
  request: CriterioClinicoRequest,
): Promise<CriterioClinico> {
  const response = await apiClient.post<CriterioClinico>(BASE_PATH, request);
  return response.data;
}

export async function update(
  id: number,
  request: CriterioClinicoRequest,
): Promise<CriterioClinico> {
  const response = await apiClient.put<CriterioClinico>(
    `${BASE_PATH}/${id}`,
    request,
  );
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
