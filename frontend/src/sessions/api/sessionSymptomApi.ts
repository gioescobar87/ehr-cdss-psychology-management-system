import apiClient from "../../shared/api/apiClient";
import type {
  ClinicalCriterion,
  SessionSymptomBatchRequest,
  SessionSymptom,
  SessionSymptomRequest,
} from "../types/sessionSymptom.types";

export async function getClinicalCriteria(): Promise<ClinicalCriterion[]> {
  const response = await apiClient.get<ClinicalCriterion[]>(
    "/catalogos/criterio-clinico",
  );
  return response.data;
}

export async function getPatientSymptoms(
  patientId: number,
): Promise<SessionSymptom[]> {
  const response = await apiClient.get<SessionSymptom[]>(
    `/paciente/${patientId}/sintomas`,
  );
  return response.data;
}

export async function createSessionSymptom(
  request: SessionSymptomRequest,
): Promise<SessionSymptom> {
  const response = await apiClient.post<SessionSymptom>(
    "/sesion-criterio-clinico",
    request,
  );
  return response.data;
}

export async function createSessionSymptomsBatch(
  request: SessionSymptomBatchRequest,
): Promise<SessionSymptom[]> {
  const response = await apiClient.post<SessionSymptom[]>(
    "/sesion-criterio-clinico/batch",
    request,
  );
  return response.data;
}

export async function updateSessionSymptom(
  id: number,
  request: SessionSymptomRequest,
): Promise<SessionSymptom> {
  const response = await apiClient.put<SessionSymptom>(
    `/sesion-criterio-clinico/${id}`,
    request,
  );
  return response.data;
}
