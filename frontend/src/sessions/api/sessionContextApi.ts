import apiClient from "../../shared/api/apiClient";

import type { Appointment } from "../../appointments/types/appointment.types";
import type {
  DiagnosticoPaciente,
  EvaluacionRiesgo,
  ObjetivoTerapia,
  SesionPaciente,
  SessionNote,
  SessionNoteRequest,
} from "../types/sessionContext.types";

export async function getPatientSessions(
  patientId: number,
): Promise<SesionPaciente[]> {
  const response = await apiClient.get<SesionPaciente[]>(
    `/paciente/${patientId}/sesiones`,
  );

  return response.data;
}

export async function getPatientDiagnoses(
  patientId: number,
): Promise<DiagnosticoPaciente[]> {
  const response = await apiClient.get<DiagnosticoPaciente[]>(
    `/paciente/${patientId}/diagnosticos`,
  );

  return response.data;
}

export async function getPatientRiskEvaluations(
  patientId: number,
): Promise<EvaluacionRiesgo[]> {
  const response = await apiClient.get<EvaluacionRiesgo[]>(
    `/paciente/${patientId}/evaluaciones-riesgo`,
  );

  return response.data;
}

export async function getPatientObjectives(
  patientId: number,
): Promise<ObjetivoTerapia[]> {
  const response = await apiClient.get<ObjetivoTerapia[]>(
    `/paciente/${patientId}/objetivos`,
  );

  return response.data;
}

export async function getPatientAppointments(
  patientId: number,
): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>(
    `/paciente/${patientId}/citas`,
  );

  return response.data;
}

export async function getSessionNotes(
  sessionId: number,
): Promise<SessionNote[]> {
  const response = await apiClient.get<SessionNote[]>(
    `/sesion/${sessionId}/notas-sesion`,
  );

  return response.data;
}

export async function createSessionNote(
  request: SessionNoteRequest,
): Promise<SessionNote> {
  const response = await apiClient.post<SessionNote>("/nota-sesion", request);

  return response.data;
}

export async function updateSessionNote(
  id: number,
  request: SessionNoteRequest,
): Promise<SessionNote> {
  const response = await apiClient.put<SessionNote>(
    `/nota-sesion/${id}`,
    request,
  );

  return response.data;
}
