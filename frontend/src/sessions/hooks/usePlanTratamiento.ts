import { useQuery } from "@tanstack/react-query";

import { getPatientTreatmentPlans } from "../api/planTratamientoApi";

export function usePatientTreatmentPlans(pacienteId?: number) {
  return useQuery({
    queryKey: ["patient-treatment-plans", pacienteId],
    queryFn: () => getPatientTreatmentPlans(pacienteId!),
    enabled: Boolean(pacienteId),
  });
}
