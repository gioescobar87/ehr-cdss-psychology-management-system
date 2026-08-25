import { useQuery } from "@tanstack/react-query";

import {
  getAllergens,
  getAllergySeverities,
  getFamilyRelationships,
  getMedicalConditions,
  getMedications,
} from "../api/patientCatalogApi";

export function usePatientCatalogs(enabled: boolean) {
  return {
    conditions: useQuery({
      queryKey: ["patient-catalog", "conditions"],
      queryFn: getMedicalConditions,
      enabled,
    }),
    relationships: useQuery({
      queryKey: ["patient-catalog", "relationships"],
      queryFn: getFamilyRelationships,
      enabled,
    }),
    allergens: useQuery({
      queryKey: ["patient-catalog", "allergens"],
      queryFn: getAllergens,
      enabled,
    }),
    severities: useQuery({
      queryKey: ["patient-catalog", "severities"],
      queryFn: getAllergySeverities,
      enabled,
    }),
    medications: useQuery({
      queryKey: ["patient-catalog", "medications"],
      queryFn: getMedications,
      enabled,
    }),
  };
}
