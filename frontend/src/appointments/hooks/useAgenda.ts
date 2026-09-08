import { useQuery } from "@tanstack/react-query";
import { getAgenda } from "../api/appointmentApi";

export function useAgenda(fecha: string, usuarioId?: number, enabled = true) {
  return useQuery({
    queryKey: ["appointments", "agenda", fecha, usuarioId],
    queryFn: () => getAgenda(fecha, usuarioId),
    enabled: Boolean(fecha) && enabled,
  });
}
