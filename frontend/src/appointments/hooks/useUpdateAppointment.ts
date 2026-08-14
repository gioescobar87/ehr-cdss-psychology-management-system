import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAppointment } from "../api/appointmentApi";

import type { AppointmentRequest } from "../types/appointment.types";

export function useUpdateAppointment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: AppointmentRequest;
    }) => updateAppointment(id, request),

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
    },
  });
}
