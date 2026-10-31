import apiClient from "../../shared/api/apiClient";
import type {
  CatalogReference,
  DiagnosticoCriterioClinico,
  DiagnosticoCriterioClinicoRequest,
} from "../types/diagnosticCatalog.types";

const BASE_PATH = "/catalogos/diagnostico-criterio-clinico";

export async function getDiagnoses(): Promise<CatalogReference[]> {
  const response = await apiClient.get<CatalogReference[]>(
    "/catalogos/diagnostico",
  );
  return response.data;
}

export async function getClinicalCriteria(): Promise<CatalogReference[]> {
  const response = await apiClient.get<CatalogReference[]>(
    "/catalogos/criterio-clinico",
  );
  return response.data;
}

export async function getAll(): Promise<DiagnosticoCriterioClinico[]> {
  const response = await apiClient.get<DiagnosticoCriterioClinico[]>(BASE_PATH);
  return response.data;
}

export async function getById(id: number): Promise<DiagnosticoCriterioClinico> {
  const response = await apiClient.get<DiagnosticoCriterioClinico>(
    `${BASE_PATH}/${id}`,
  );
  return response.data;
}

export async function create(
  request: DiagnosticoCriterioClinicoRequest,
): Promise<DiagnosticoCriterioClinico> {
  const response = await apiClient.post<DiagnosticoCriterioClinico>(
    BASE_PATH,
    request,
  );
  return response.data;
}

export async function update(
  id: number,
  request: DiagnosticoCriterioClinicoRequest,
): Promise<DiagnosticoCriterioClinico> {
  const response = await apiClient.put<DiagnosticoCriterioClinico>(
    `${BASE_PATH}/${id}`,
    request,
  );
  return response.data;
}

export async function remove(id: number): Promise<void> {
  await apiClient.delete(`${BASE_PATH}/${id}`);
}
