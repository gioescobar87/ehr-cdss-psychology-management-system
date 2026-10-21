import apiClient from "../../shared/api/apiClient";
import type {
  CoordinatorAgendaAppointment,
  CoordinatorPatient,
  CoordinatorSummary,
  CoordinatorCancellation,
  CoordinatorDiagnosticAgreement,
} from "../types/coordinatorReport.types";

export async function getCoordinatorSummary(
  startDate: string,
  endDate: string,
): Promise<CoordinatorSummary[]> {
  const response = await apiClient.get<CoordinatorSummary[]>(
    "/coordinator-report/summary",
    {
      params: { startDate, endDate },
    },
  );
  return response.data;
}

export async function getCoordinatorPatients(): Promise<CoordinatorPatient[]> {
  const response = await apiClient.get<CoordinatorPatient[]>(
    "/coordinator-report/patients",
  );
  return response.data;
}

export async function getCoordinatorAgenda(
  startDate: string,
): Promise<CoordinatorAgendaAppointment[]> {
  const response = await apiClient.get<CoordinatorAgendaAppointment[]>(
    "/coordinator-report/agenda",
    { params: { startDate } },
  );
  return response.data;
}

export async function getCoordinatorCancellations(): Promise<CoordinatorCancellation[]> {
  const response = await apiClient.get<CoordinatorCancellation[]>(
    "/coordinator-report/cancellations",
  );
  return response.data;
}

export async function getCoordinatorDiagnosticAgreement(
  startDate: string,
  endDate: string,
): Promise<CoordinatorDiagnosticAgreement[]> {
  const response = await apiClient.get<CoordinatorDiagnosticAgreement[]>(
    "/coordinator-report/diagnostic-concordance",
    { params: { startDate, endDate } },
  );
  return response.data;
}
