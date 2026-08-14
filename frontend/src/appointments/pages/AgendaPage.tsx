import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    CircularProgress
} from "@mui/material";

import AgendaToolbar from "../components/AgendaToolbar";
import AgendaSummary from "../components/AgendaSummary";
import DayAgenda from "../components/DayAgenda";
import AppointmentDialog from "../components/AppointmentDialog";
import { useAgenda } from "../hooks/useAgenda";

import {
    toDateInputValue
} from "../../shared/utils/dateUtils";

import type { Appointment } from "../types/appointment.types";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";


export default function AgendaPage() {

    const navigate = useNavigate();

    const [
        selectedDate,
        setSelectedDate
    ] = useState(
        toDateInputValue(new Date())
    );

    const [
        appointmentDialogOpen,
        setAppointmentDialogOpen
    ] = useState(false);

    const [
        appointmentInitialStartTime,
        setAppointmentInitialStartTime
    ] = useState<
        string | undefined
    >();

    const {
        data: appointments = [],
        isLoading,
        isError
    } = useAgenda(selectedDate);

    const sortedAppointments =
        useMemo(() =>
                [...appointments].sort(
                    (a, b) =>
                        new Date(a.fechaHoraInicio).getTime()
                        -
                        new Date(b.fechaHoraInicio).getTime()
                ),[appointments]
        );

    const agendaAppointments = useMemo(
        () =>
            appointments
                .filter(
                    appointment =>
                        appointment.estadoId !==
                        APPOINTMENT_STATUS.CANCELLED
                )
                .sort(
                    (a, b) =>
                        new Date(
                            a.fechaHoraInicio
                        ).getTime()
                        -
                        new Date(
                            b.fechaHoraInicio
                        ).getTime()
                ),
        [appointments]
    );

    const handleAppointmentClick =
        (
            appointment: Appointment
        ) => {
            navigate(`/citas/${appointment.id}`);
        };

    const handleCreateAppointment =
        () => {
            setAppointmentInitialStartTime(undefined);
            setAppointmentDialogOpen(true);
        };

    const handleEmptySlotClick =
        (
            time: string
        ) => {
            setAppointmentInitialStartTime(time);
            setAppointmentDialogOpen(true);
        };

    return (
        <Box>
            <AgendaToolbar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onCreateAppointment={handleCreateAppointment}
            />

            {isError && (
                <Alert
                    severity="error"
                    sx={{ mb: 3 }}
                >
                    No fue posible cargar la agenda.
                </Alert>
            )}

            {isLoading ? (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        py: 8
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <AgendaSummary
                        appointments={sortedAppointments}
                        selectedDate={selectedDate}
                    />
                    <DayAgenda
                        appointments={agendaAppointments}
                        selectedDate={selectedDate}
                        onAppointmentClick={handleAppointmentClick}
                        onEmptySlotClick={handleEmptySlotClick}
                    />
                </>
            )}

            <AppointmentDialog
                open={appointmentDialogOpen}
                initialDate={selectedDate}
                initialStartTime={appointmentInitialStartTime}
                onClose={() =>
                    setAppointmentDialogOpen(false)
                }
            />
        </Box>
    );
}