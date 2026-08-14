import { useQuery } from "@tanstack/react-query";
import { getAgenda } from "../api/appointmentApi";

export function useAgenda(fecha: string) {
  return useQuery({
    queryKey: ["appointments", "agenda", fecha],
    queryFn: () => getAgenda(fecha),
    enabled: Boolean(fecha),
  });
}
