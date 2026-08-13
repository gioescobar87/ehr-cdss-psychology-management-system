import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import AppointmentForm
    from "../components/AppointmentForm";

import {
    useAppointment
} from "../hooks/useAppointment";

import {
    useAssignedPatients
} from "../hooks/useAssignedPatients";

import {
    useUpdateAppointment
} from "../hooks/useUpdateAppointment";

import { combineDateAndTime } from "../../shared/utils/dateUtils";

import type {
    AppointmentFormValues,
    AppointmentRequest
} from "../types/appointment.types";

import { useAuth } from "../../auth/hooks/useAuth";

export default function AppointmentEditPage() {

    const navigate = useNavigate();

    const { id } = useParams();

    const appointmentId =
        id ? Number(id) : undefined;

    const {
        user
    } = useAuth();

    const {
        data: appointment,
        isLoading: appointmentLoading,
        isError: appointmentError
    } = useAppointment(
        appointmentId
    );

    const {
        data: patients = [],
        isLoading: patientsLoading,
        isError: patientsError
    } = useAssignedPatients(
        user?.id
    );

    const {
        mutateAsync: updateAppointment,
        isPending
    } = useUpdateAppointment();

    if (
        appointmentLoading ||
        patientsLoading
    ) {

        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    py: 8
                }}
            >
                <CircularProgress />
            </Box>
        );

    }

    if (
        appointmentError ||
        patientsError ||
        !appointment
    ) {

        return (
            <Alert severity="error">
                No fue posible cargar la información de la cita.
            </Alert>
        );

    }

    /*
     * A cancelled appointment should not normally
     * reach this page because the details page hides
     * the edit button.
     *
     * This additional protection prevents direct URL access.
     */
    if (
        appointment.estadoId === 7
    ) {

        navigate(
            `/citas/${appointment.id}`,
            {
                replace: true
            }
        );

        return null;
    }

    const initialValues:
        AppointmentFormValues = {

        pacienteId:
            appointment.pacienteId,

        fecha:
            appointment.fechaHoraInicio
                .slice(0, 10),

        horaInicio:
            appointment.fechaHoraInicio
                .slice(11, 16),

        horaFin:
            appointment.fechaHoraFin
                .slice(11, 16),

        motivo:
            appointment.motivo ?? "",

        observaciones:
            appointment.observaciones ?? ""
    };

    const handleSubmit = async (
        values: AppointmentFormValues
    ) => {

        const request:
            AppointmentRequest = {

            pacienteId:
                values.pacienteId!,

            /*
             * Preserve the psychologist already
             * associated with the appointment.
             */
            usuarioId:
                appointment.usuarioId,

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

            /*
             * VERY IMPORTANT:
             * preserve the existing state.
             */
            estadoId:
                appointment.estadoId
        };

        await updateAppointment({
            id: appointment.id,
            request
        });

        navigate(
            `/citas/${appointment.id}`
        );
    };

    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto"
            }}
        >

            <AppointmentForm
                mode="edit"
                patients={patients}
                initialValues={
                    initialValues
                }
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
                    navigate(
                        `/citas/${appointment.id}`
                    )
                }
            />

        </Box>
    );
}