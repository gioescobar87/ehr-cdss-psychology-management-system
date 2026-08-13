import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import {
    createAppointment
} from "../api/appointmentApi";

import type {
    AppointmentRequest
} from "../types/appointment.types";


export function useCreateAppointment() {

    const queryClient =
        useQueryClient();

    return useMutation({
        mutationFn: (
            request: AppointmentRequest
        ) => createAppointment(request),

        onSuccess: () => {

            queryClient.invalidateQueries({
                queryKey: ["appointments"]
            });

            queryClient.invalidateQueries({
                queryKey: ["agenda"]
            });

        }
    });

}