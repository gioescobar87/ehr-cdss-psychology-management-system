import { useQuery } from "@tanstack/react-query";
import { getAppointmentSessions } from "../api/appointmentApi";

export function useAppointmentSession(
  citaId: number | undefined,
  enabled = true,
) {
  return useQuery({
    queryKey: ["appointment", citaId, "session"],
    queryFn: async () => {
      const sessions = await getAppointmentSessions(citaId!);
      if (sessions.length === 0) {
        return null;
      }

      return [...sessions].sort(
        (a, b) =>
          new Date(b.fechaSesion).getTime() - new Date(a.fechaSesion).getTime(),
      )[0];
    },
    enabled: enabled && citaId !== undefined,
  });
}
