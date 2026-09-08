import { useQuery } from "@tanstack/react-query";
import { getAppointments, getUserAppointments } from "../api/appointmentApi";

export function useAppointments(usuarioId?: number, enabled = true) {
  return useQuery({
    queryKey: ["appointments", "all", usuarioId],
    queryFn: () =>
      usuarioId === undefined
        ? getAppointments()
        : getUserAppointments(usuarioId),
    enabled,
  });
}
