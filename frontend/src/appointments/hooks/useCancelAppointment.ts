import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";

import {
    cancelAppointment
} from "../api/appointmentApi";

import type {
    CancellationRequest
} from "../types/appointment.types";


export function useCancelAppointment() {

    const queryClient =
        useQueryClient();


    return useMutation({

        mutationFn: ({
            id,
            request
        }: {
            id: number;
            request: CancellationRequest;
        }) =>
            cancelAppointment(
                id,
                request
            ),


        onSuccess: (_, variables) => {

            queryClient.invalidateQueries({
                queryKey: ["appointments"]
            });


            queryClient.invalidateQueries({
                queryKey: ["agenda"]
            });


            queryClient.invalidateQueries({
                queryKey: [
                    "appointment",
                    variables.id
                ]
            });


            queryClient.invalidateQueries({
                queryKey: [
                    "cancellation",
                    variables.id
                ]
            });

        }

    });

}