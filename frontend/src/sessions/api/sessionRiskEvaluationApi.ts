import apiClient from "../../shared/api/apiClient";

import type {
  RiskEvaluationRequest,
  RiskLevel,
  RiskType,
  SessionRiskEvaluation,
} from "../types/sessionRiskEvaluation.types";

export async function getSessionRiskEvaluations(
  sessionId: number,
): Promise<SessionRiskEvaluation[]> {
  const response = await apiClient.get<SessionRiskEvaluation[]>(
    `/sesion/${sessionId}/evaluacion-riesgo`,
  );

  return response.data;
}

export async function getPatientRiskEvaluations(
  patientId: number,
): Promise<SessionRiskEvaluation[]> {
  const response = await apiClient.get<SessionRiskEvaluation[]>(
    `/paciente/${patientId}/evaluaciones-riesgo`,
  );

  return response.data;
}

export async function getRiskTypes(): Promise<RiskType[]> {
  const response = await apiClient.get<RiskType[]>("/catalogos/tipo-riesgo");

  return response.data;
}

export async function getRiskLevels(): Promise<RiskLevel[]> {
  const response = await apiClient.get<RiskLevel[]>("/catalogos/nivel-riesgo");

  return response.data;
}

export async function createRiskEvaluation(
  request: RiskEvaluationRequest,
): Promise<SessionRiskEvaluation> {
  const response = await apiClient.post<SessionRiskEvaluation>(
    "/evaluacion-riesgo",
    request,
  );

  return response.data;
}

export async function updateRiskEvaluation(
  id: number,
  request: RiskEvaluationRequest,
): Promise<SessionRiskEvaluation> {
  const response = await apiClient.put<SessionRiskEvaluation>(
    `/evaluacion-riesgo/${id}`,
    request,
  );

  return response.data;
}

export async function deleteRiskEvaluation(id: number): Promise<void> {
  await apiClient.delete(`/evaluacion-riesgo/${id}`);
}
