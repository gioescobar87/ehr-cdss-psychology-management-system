import { useQuery } from "@tanstack/react-query";

import {
  getCoordinatorAgenda,
  getCoordinatorCancellations,
  getCoordinatorDiagnosticAgreement,
  getCoordinatorPatients,
  getCoordinatorSummary,
} from "../api/coordinatorReportApi";

export function useCoordinatorSummary(
  startDate: string,
  endDate: string,
  enabled = true,
) {
  return useQuery({
    queryKey: ["coordinator-report", "summary", startDate, endDate],
    queryFn: () => getCoordinatorSummary(startDate, endDate),
    enabled,
    staleTime: 60_000,
  });
}

export function useCoordinatorPatients(enabled = true) {
  return useQuery({
    queryKey: ["coordinator-report", "patients"],
    queryFn: getCoordinatorPatients,
    enabled,
    staleTime: 60_000,
  });
}

export function useCoordinatorAgenda(startDate: string, enabled = true) {
  return useQuery({
    queryKey: ["coordinator-report", "agenda", startDate],
    queryFn: () => getCoordinatorAgenda(startDate),
    enabled,
    staleTime: 60_000,
  });
}

export function useCoordinatorCancellations(enabled = true) {
  return useQuery({
    queryKey: ["coordinator-report", "cancellations"],
    queryFn: getCoordinatorCancellations,
    enabled,
    staleTime: 60_000,
  });
}

export function useCoordinatorDiagnosticAgreement(
  startDate: string,
  endDate: string,
  enabled = true,
) {
  return useQuery({
    queryKey: [
      "coordinator-report",
      "diagnostic-agreement",
      startDate,
      endDate,
    ],
    queryFn: () => getCoordinatorDiagnosticAgreement(startDate, endDate),
    enabled,
    staleTime: 60_000,
  });
}
