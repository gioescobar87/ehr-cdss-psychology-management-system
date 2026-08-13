import EventIcon from "@mui/icons-material/Event";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import type { ReactNode } from "react";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";
import { isToday, formatAppointmentTime } from "../../shared/utils/dateUtils";
import { useCurrentTime } from "../../shared/hooks/useCurrentTime";

import {
    Box,
    Paper,
    Stack,
    Typography
} from "@mui/material";

import type { Appointment }
    from "../types/appointment.types";


interface AgendaSummaryProps {
    appointments: Appointment[];
    selectedDate: string;
}


export default function AgendaSummary({
    appointments,
    selectedDate
}: AgendaSummaryProps) {

    const total =
        appointments.length;

    const confirmed =
        appointments.filter(
            appointment =>
                appointment.estado
                    ?.trim()
                    .toLowerCase() === "confirmada"
        ).length;

    const pending =
        appointments.filter(
            appointment =>
                appointment.estado
                    ?.trim()
                    .toLowerCase() === "pendiente"
        ).length;

    const cancelled =
        appointments.filter(
            appointment =>
                appointment.estadoId === APPOINTMENT_STATUS.CANCELLED ||
                appointment.estado
                    ?.trim()
                    .toLowerCase() === "cancelada"
        ).length;

    const currentTime =
        useCurrentTime();

    const sortedAppointments =
        [...appointments].sort(
            (a, b) =>
                new Date(
                    a.fechaHoraInicio
                ).getTime()
                -
                new Date(
                    b.fechaHoraInicio
                ).getTime()
        );

    const nextAppointment =
        isToday(selectedDate)
            ? sortedAppointments.find(
                appointment =>
                    appointment.estadoId !== APPOINTMENT_STATUS.CANCELLED &&
                    appointment.estadoId !== APPOINTMENT_STATUS.COMPLETED &&
                    appointment.estadoId !== APPOINTMENT_STATUS.NO_SHOW &&
                    new Date(
                        appointment.fechaHoraFin
                    ).getTime() >=
                        currentTime.getTime()
            )
            : undefined;

    return (
        <Stack spacing={2} sx={{ mb: 3 }}>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "repeat(2, 1fr)",
                        md: "repeat(4, 1fr)"
                    },
                    gap: 2
                }}
            >

                <SummaryCard
                    icon={<EventIcon />}
                    value={total}
                    label="Citas"
                />

                <SummaryCard
                    icon={<CheckCircleOutlineIcon />}
                    value={confirmed}
                    label="Confirmadas"
                />

                <SummaryCard
                    icon={<ScheduleIcon />}
                    value={pending}
                    label="Pendientes"
                />

                <SummaryCard
                    icon={<CancelOutlinedIcon />}
                    value={cancelled}
                    label="Canceladas"
                />

            </Box>


            {nextAppointment && (
                <Paper
                    variant="outlined"
                    sx={{
                        p: 2,
                        borderColor: "primary.main",
                        backgroundColor: "primary.50",
                        borderLeft: "4px solid",
                        borderLeftColor: "primary.main"
                    }}
                >

                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        Próxima cita
                    </Typography>

                    <Typography
                        variant="h6"
                        fontWeight={600}
                    >
                        {nextAppointment.pacienteNombre}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {formatAppointmentTime(
                            nextAppointment.fechaHoraInicio
                        )}

                        {" – "}

                        {formatAppointmentTime(
                            nextAppointment.fechaHoraFin
                        )}
                    </Typography>

                </Paper>
            )}

        </Stack>
    );
}


interface SummaryCardProps {
    icon: ReactNode;
    value: number;
    label: string;
}


function SummaryCard({
    icon,
    value,
    label
}: SummaryCardProps) {

    return (
        <Paper
            variant="outlined"
            sx={{
                p: 2
            }}
        >

            <Stack
                direction="row"
                alignItems="center"
                spacing={2}
            >

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center"
                    }}
                >
                    {icon}
                </Box>

                <Box>

                    <Typography
                        variant="h4"
                        fontWeight={600}
                        lineHeight={1}
                    >
                        {value}
                    </Typography>

                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            mt: 0.5
                        }}
                    >
                        {label}
                    </Typography>

                </Box>

            </Stack>

        </Paper>
    );
}