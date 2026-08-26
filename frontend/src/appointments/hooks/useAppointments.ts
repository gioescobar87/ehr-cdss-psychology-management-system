import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../api/appointmentApi";

export function useAppointments(enabled = true) {
  return useQuery({
    queryKey: ["appointments", "all"],
    queryFn: getAppointments,
    enabled,
  });
}
