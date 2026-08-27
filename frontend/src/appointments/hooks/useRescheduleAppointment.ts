import { useMutation, useQueryClient } from "@tanstack/react-query";

import { rescheduleAppointment } from "../api/appointmentApi";

import type { RescheduleRequest } from "../types/appointment.types";

export function useRescheduleAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: RescheduleRequest }) =>
      rescheduleAppointment(id, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["appointments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["agenda"],
      });

      queryClient.invalidateQueries({
        queryKey: ["appointment", variables.id],
      });

      queryClient.invalidateQueries({
        queryKey: ["cancellation", variables.id],
      });
    },
  });
}
