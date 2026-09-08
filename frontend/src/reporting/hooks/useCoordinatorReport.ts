import { useQuery } from "@tanstack/react-query";

import {
  getCoordinatorAgenda,
  getCoordinatorPatients,
  getCoordinatorSummary,
} from "../api/coordinatorReportApi";

export function useCoordinatorSummary(startDate: string, endDate: string) {
  return useQuery({
    queryKey: ["coordinator-report", "summary", startDate, endDate],
    queryFn: () => getCoordinatorSummary(startDate, endDate),
  });
}

export function useCoordinatorPatients() {
  return useQuery({
    queryKey: ["coordinator-report", "patients"],
    queryFn: getCoordinatorPatients,
  });
}

export function useCoordinatorAgenda(startDate: string) {
  return useQuery({
    queryKey: ["coordinator-report", "agenda", startDate],
    queryFn: () => getCoordinatorAgenda(startDate),
  });
}
