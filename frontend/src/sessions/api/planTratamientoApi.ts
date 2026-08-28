import apiClient from "../../shared/api/apiClient";

import type { PlanTratamiento } from "../types/planTratamiento.types";

export async function getPatientTreatmentPlans(
  patientId: number,
): Promise<PlanTratamiento[]> {
  const response = await apiClient.get<PlanTratamiento[]>(
    `/paciente/${patientId}/planes-tratamiento`,
  );

  return response.data;
}
