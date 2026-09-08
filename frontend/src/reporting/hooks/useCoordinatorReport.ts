import { useQuery } from "@tanstack/react-query";

import {
  getCoordinatorAgenda,
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
