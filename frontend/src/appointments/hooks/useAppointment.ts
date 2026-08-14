import { useQuery } from "@tanstack/react-query";
import { getAppointmentById } from "../api/appointmentApi";

export function useAppointment(id: number | undefined) {
  return useQuery({
    queryKey: ["appointments", id],
    queryFn: () => getAppointmentById(id!),
    enabled: id !== undefined,
  });
}
