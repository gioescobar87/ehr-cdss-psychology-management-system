import {
    Alert,
    Box
} from "@mui/material";

import { useNavigate } from "react-router-dom";

import AppointmentForm
    from "../components/AppointmentForm";

import { useAssignedPatients } 
    from "../hooks/useAssignedPatients";

import {
    useCreateAppointment
} from "../hooks/useCreateAppointment";

import {
    combineDateAndTime
} from "../../shared/utils/dateUtils";

import {
    APPOINTMENT_STATUS
} from "../constants/appointmentStatus";

import type {
    AppointmentFormValues,
    AppointmentRequest
} from "../types/appointment.types";

import { useAuth } from "../../auth/hooks/useAuth";
import { useState } from "react";
import { getApiErrorMessage } from "../../shared/api/apiError";

export default function AppointmentCreatePage() {

    const navigate = useNavigate();

    const {
        user
    } = useAuth();

    const usuarioId = user?.id;

    const [
        submitError,
        setSubmitError
    ] = useState<string | null>(null);

    const {
        data: patients = [],
        isLoading: patientsLoading,
        isError: patientsError
    } = useAssignedPatients(
        usuarioId
    );

    const {
        mutateAsync: createAppointment,
        isPending
    } = useCreateAppointment();

    if (!usuarioId) {

        return (
            <Alert severity="error">
                No fue posible identificar al usuario autenticado.
            </Alert>
        );

    }

    if (patientsError) {

        return (
            <Alert severity="error">
                No fue posible cargar los pacientes asignados.
            </Alert>
        );

    }

    const handleSubmit = async (
        values: AppointmentFormValues
    ) => {

        setSubmitError(null);

        try {

            const request: AppointmentRequest = {
                pacienteId: values.pacienteId!,
                usuarioId,
                fechaHoraInicio:
                    combineDateAndTime(
                        values.fecha,
                        values.horaInicio
                    ),
                fechaHoraFin:
                    combineDateAndTime(
                        values.fecha,
                        values.horaFin
                    ),
                motivo:
                    values.motivo || undefined,
                observaciones:
                    values.observaciones || undefined,
                estadoId:
                    APPOINTMENT_STATUS.SCHEDULED
            };

            const appointment =
                await createAppointment(
                    request
                );

            navigate(
                `/appointments/${appointment.id}`
            );

        } catch (error) {

            setSubmitError(
                getApiErrorMessage(
                    error,
                    "No fue posible crear la cita."
                )
            );
        }
    };

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto"
            }}
        >

            {submitError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    {submitError}
                </Alert>
            )}

            <AppointmentForm
                mode="create"
                patients={patients}
                isLoading={
                    patientsLoading
                }
                isSubmitting={
                    isPending
                }
                onSubmit={
                    handleSubmit
                }
                onCancel={() =>
                    navigate("/appointments")
                }
            />

        </Box>
    );
}