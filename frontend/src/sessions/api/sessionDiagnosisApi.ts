import apiClient from "../../shared/api/apiClient";

import type { Response as CatalogDiagnosis } from "../types/sessionDiagnosis.types";
import type { PatientDiagnosisRequest } from "../types/sessionDiagnosis.types";
import type {
  FinalizeInferenceRequest,
  FinalizeInferenceResponse,
  InferencePreparation,
} from "../types/sessionDiagnosis.types";

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

export async function prepareSessionInference(
  sessionId: number,
  diagnosticoSeleccionadoId: number,
): Promise<InferencePreparation> {
  const response = await apiClient.post<InferencePreparation>(
    `/inference/sesion/${sessionId}/preguntas`,
    { diagnosticoSeleccionadoId },
  );
  return response.data;
}

export async function finalizeSessionInference(
  sessionId: number,
  request: FinalizeInferenceRequest,
): Promise<FinalizeInferenceResponse> {
  const response = await apiClient.post<FinalizeInferenceResponse>(
    `/inference/sesion/${sessionId}/finalizar`,
    request,
  );
  return response.data;
}
