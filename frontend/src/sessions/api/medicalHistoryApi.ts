import apiClient from "../../shared/api/apiClient";
import type {
  AllergyHistoryItem,
  FamilyHistoryItem,
  MedicalHistoryItem,
  MedicationHistoryItem,
} from "../types/medicalHistory.types";

export async function getMedicalHistory(
  patientId: number,
): Promise<MedicalHistoryItem[]> {
  const response = await apiClient.get<MedicalHistoryItem[]>(
    `/historial-medico/paciente/${patientId}`,
  );
  return response.data;
}

export async function getFamilyHistory(
  patientId: number,
): Promise<FamilyHistoryItem[]> {
  const response = await apiClient.get<FamilyHistoryItem[]>(
    `/historial-familiar/paciente/${patientId}`,
  );
  return response.data;
}

export async function getAllergies(
  patientId: number,
): Promise<AllergyHistoryItem[]> {
  const response = await apiClient.get<AllergyHistoryItem[]>(
    `/paciente/${patientId}/alergia`,
  );
  return response.data;
}

export async function getMedications(
  patientId: number,
): Promise<MedicationHistoryItem[]> {
  const response = await apiClient.get<MedicationHistoryItem[]>(
    `/paciente/${patientId}/medicamento`,
  );
  return response.data;
}
