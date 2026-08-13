import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    Alert,
    Box,
    CircularProgress,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import AgendaToolbar
    from "../components/AgendaToolbar";

import AppointmentCard
    from "../components/AppointmentCard";

import { useAgenda } from "../hooks/useAgenda";

import {
    toDateInputValue
} from "../../shared/utils/dateUtils";

import type { Appointment } from "../types/appointment.types";


export default function AgendaPage() {

    const navigate = useNavigate();

    const [
        selectedDate,
        setSelectedDate
    ] = useState(
        toDateInputValue(new Date())
    );

    const {
        data: appointments = [],
        isLoading,
        isError
    } = useAgenda(selectedDate);


    const sortedAppointments =
        useMemo(
            () =>
                [...appointments].sort(
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
        (appointment: Appointment) => {

            navigate(
                `/citas/${appointment.id}`
            );

        };


    return (
        <Box>

            <AgendaToolbar
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                onCreateAppointment={() =>
                    navigate("/citas/new")
                }
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

                <AgendaContent
                    appointments={sortedAppointments}
                    onAppointmentClick={
                        handleAppointmentClick
                    }
                />

            )}

        </Box>
    );
}


interface AgendaContentProps {
    appointments: Appointment[];
    onAppointmentClick: (
        appointment: Appointment
    ) => void;
}


function AgendaContent({
    appointments,
    onAppointmentClick
}: AgendaContentProps) {

    if (appointments.length === 0) {

        return (
            <Paper
                variant="outlined"
                sx={{
                    py: 8,
                    px: 3,
                    textAlign: "center"
                }}
            >

                <Typography
                    variant="h6"
                    gutterBottom
                >
                    No hay citas programadas
                </Typography>

                <Typography
                    variant="body2"
                    color="text.secondary"
                >
                    No existen citas para la fecha
                    seleccionada.
                </Typography>

            </Paper>
        );

    }


    return (
        <Stack spacing={2}>

            {appointments.map(
                appointment => (

                    <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        onClick={
                            onAppointmentClick
                        }
                    />

                )
            )}

        </Stack>
    );
}