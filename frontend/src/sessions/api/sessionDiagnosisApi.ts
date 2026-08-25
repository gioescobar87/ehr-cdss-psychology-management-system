import apiClient from "../../shared/api/apiClient";

import type { Response as CatalogDiagnosis } from "../types/sessionDiagnosis.types";
import type { PatientDiagnosisRequest } from "../types/sessionDiagnosis.types";

export async function getDiagnoses(): Promise<CatalogDiagnosis[]> {
  const response = await apiClient.get<CatalogDiagnosis[]>(
    "/catalogos/diagnostico",
  );

  return response.data;
}

export async function createPatientDiagnosis(
  request: PatientDiagnosisRequest,
): Promise<void> {
  await apiClient.post("/paciente-diagnostico", request);
}
