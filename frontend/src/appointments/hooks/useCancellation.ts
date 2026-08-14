import { useQuery } from "@tanstack/react-query";

import { getCancellation } from "../api/appointmentApi";

export function useCancellation(appointmentId: number | undefined) {
  return useQuery({
    queryKey: ["appointments", appointmentId, "cancellation"],

    queryFn: () => getCancellation(appointmentId!),

    enabled: appointmentId !== undefined,
  });
}
