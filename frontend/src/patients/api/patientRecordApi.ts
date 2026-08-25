import apiClient from "../../shared/api/apiClient";

import type {
  AllergyHistoryItem,
  FamilyHistoryItem,
  MedicalHistoryItem,
  MedicationHistoryItem,
} from "../../sessions/types/medicalHistory.types";
import type { PatientHistoryRequest } from "../types/patientHistory.types";

export async function updatePatientHistory(
  patientId: number,
  request: PatientHistoryRequest,
): Promise<void> {
  await apiClient.put(`/paciente/${patientId}/historial`, request);
}

export interface MedicalHistoryRequest {
  pacienteId: number;
  condicionMedicaId: number;
  fechaDiagnostico: string;
  tratamientoActual: string;
  observaciones?: string;
}

export interface FamilyHistoryRequest {
  pacienteId: number;
  condicionMedicaId: number;
  parentescoId: number;
  observaciones?: string;
}

export interface AllergyRequest {
  pacienteId: number;
  sustanciaAlergenaId: number;
  nivelSeveridadAlergiaId?: number;
  tipoReaccion?: string;
  observaciones?: string;
  estadoId: number;
}

export interface MedicationRequest {
  pacienteId: number;
  medicamentoId: number;
  dosis?: string;
  frecuencia?: string;
  viaAdministracion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  prescritoPor?: string;
}

export const createMedicalHistory = (request: MedicalHistoryRequest) =>
  apiClient.post<MedicalHistoryItem>("/historial-medico", request);
export const createFamilyHistory = (request: FamilyHistoryRequest) =>
  apiClient.post<FamilyHistoryItem>("/historial-familiar", request);
export const createAllergy = (request: AllergyRequest) =>
  apiClient.post<AllergyHistoryItem>("/paciente-alergia", request);
export const createMedication = (request: MedicationRequest) =>
  apiClient.post<MedicationHistoryItem>("/paciente-medicamento", request);

export const deactivateMedicalHistory = (id: number) =>
  apiClient.delete(`/historial-medico/${id}`);
export const deactivateAllergy = (id: number) =>
  apiClient.delete(`/paciente-alergia/${id}`);
export const deactivateMedication = (id: number) =>
  apiClient.delete(`/paciente-medicamento/${id}`);
