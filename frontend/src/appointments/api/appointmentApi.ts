import type { Sesion } from "../../sessions/types/session.types";
import apiClient from "../../shared/api/apiClient";

import type {
  Appointment,
  AppointmentRequest,
  Cancellation,
  CancellationRequest,
  PatientAssignment,
  RescheduleRequest,
} from "../types/appointment.types";

export async function getAppointments(): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>("/cita");

  return response.data;
}

export async function getAppointmentById(id: number): Promise<Appointment> {
  const response = await apiClient.get<Appointment>(`/cita/${id}`);

  return response.data;
}

export async function createAppointment(
  request: AppointmentRequest,
): Promise<Appointment> {
  const response = await apiClient.post<Appointment>("/cita", request);

  return response.data;
}

export async function updateAppointment(
  id: number,
  request: AppointmentRequest,
): Promise<Appointment> {
  const response = await apiClient.put<Appointment>(`/cita/${id}`, request);

  return response.data;
}

export async function deleteAppointment(id: number): Promise<void> {
  await apiClient.delete(`/cita/${id}`);
}

export async function changeAppointmentStatus(
  id: number,
  estadoId: number,
): Promise<void> {
  await apiClient.patch(`/cita/${id}/estado`, null, {
    params: {
      estadoId,
    },
  });
}

export async function getAgenda(fecha: string): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>("/cita/agenda", {
    params: {
      fecha,
    },
  });

  return response.data;
}

export async function getPatientAppointments(
  pacienteId: number,
): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>(
    `/paciente/${pacienteId}/citas`,
  );

  return response.data;
}

export async function getPatientCancellations(
  pacienteId: number,
): Promise<Cancellation[]> {
  const response = await apiClient.get<Cancellation[]>(
    `/paciente/${pacienteId}/cancelaciones`,
  );

  return response.data;
}

export async function getUserAppointments(
  usuarioId: number,
): Promise<Appointment[]> {
  const response = await apiClient.get<Appointment[]>(
    `/usuarios/${usuarioId}/citas`,
  );

  return response.data;
}

export async function cancelAppointment(
  id: number,
  request: CancellationRequest,
): Promise<Appointment> {
  const response = await apiClient.post<Appointment>(
    `/cita/${id}/cancelar`,
    request,
  );

  return response.data;
}

export async function getCancellation(id: number): Promise<Cancellation> {
  const response = await apiClient.get<Cancellation>(`/cita/${id}/cancelacion`);

  return response.data;
}

export async function rescheduleAppointment(
  id: number,
  request: RescheduleRequest,
): Promise<Appointment> {
  const response = await apiClient.post<Appointment>(
    `/cita/${id}/reagendar`,
    request,
  );

  return response.data;
}

export async function getAssignedPatients(
  usuarioId: number,
): Promise<PatientAssignment[]> {
  const response = await apiClient.get<PatientAssignment[]>(
    `/usuarios/${usuarioId}/pacientes`,
  );

  return response.data;
}

export async function getAppointment(id: number): Promise<Appointment> {
  const response = await apiClient.get<Appointment>(`/cita/${id}`);

  return response.data;
}

export async function getAppointmentSessions(
  citaId: number,
): Promise<Sesion[]> {
  const response = await apiClient.get<Sesion[]>(`/cita/${citaId}/sesion`);

  return response.data;
}
