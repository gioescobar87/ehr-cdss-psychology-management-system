import { useQuery } from "@tanstack/react-query";

import { getAssignedPatients } from "../api/appointmentApi";

export function useAssignedPatients(usuarioId?: number) {
  return useQuery({
    queryKey: ["assigned-patients", usuarioId],
    queryFn: () => getAssignedPatients(usuarioId!),
    enabled: usuarioId !== undefined,
  });
}
