import { useQuery } from "@tanstack/react-query";
import { getPatientAppointments } from "../api/appointmentApi";

export function usePatientAppointments(pacienteId: number | undefined) {
  return useQuery({
    queryKey: ["appointments", "patient", pacienteId],
    queryFn: () => getPatientAppointments(pacienteId!),
    enabled: pacienteId !== undefined,
  });
}
