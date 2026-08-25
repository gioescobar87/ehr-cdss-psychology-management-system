import apiClient from "../../shared/api/apiClient";
import type { Patient, PatientRequest } from "../types/patient.types";

export async function getPatients(): Promise<Patient[]> {
  const response = await apiClient.get<Patient[]>("/paciente");
  return response.data;
}

export async function createPatient(request: PatientRequest): Promise<Patient> {
  const response = await apiClient.post<Patient>("/paciente", request);
  return response.data;
}

export async function updatePatient(
  id: number,
  request: PatientRequest,
): Promise<Patient> {
  const response = await apiClient.put<Patient>(`/paciente/${id}`, request);
  return response.data;
}
