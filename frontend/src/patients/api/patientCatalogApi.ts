import apiClient from "../../shared/api/apiClient";

export interface PatientCatalogOption {
  id: number;
  nombre: string;
  nombreComercial?: string | null;
  estado?: string | null;
}

async function getOptions(path: string): Promise<PatientCatalogOption[]> {
  const response = await apiClient.get<PatientCatalogOption[]>(path);
  return response.data;
}

export const getMedicalConditions = () =>
  getOptions("/catalogos/condicion-medica");
export const getFamilyRelationships = () => getOptions("/catalogos/parentesco");
export const getAllergens = () => getOptions("/catalogos/sustancia-alergena");
export const getAllergySeverities = () =>
  getOptions("/catalogos/severidad-alergias");
export const getMedications = () => getOptions("/catalogos/medicamento");
