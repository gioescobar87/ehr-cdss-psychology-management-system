import {
    Box,
    Paper,
    Typography
} from "@mui/material";

import type { Appointment }
    from "../types/appointment.types";
    
import { APPOINTMENT_STATUS_APPEARANCE, DEFAULT_APPOINTMENT_STATUS_APPEARANCE } from "../constants/appointmentStatusAppearance";


const DAY_START_HOUR = 7;
const DAY_END_HOUR = 20;
const HOUR_HEIGHT = 80;


interface DayAgendaProps {
    appointments: Appointment[];
    onAppointmentClick: (
        appointment: Appointment
    ) => void;
}


export default function DayAgenda({
    appointments,
    onAppointmentClick
}: DayAgendaProps) {

    const hours = Array.from(
        {
            length:
                DAY_END_HOUR -
                DAY_START_HOUR +
                1
        },
        (_, index) =>
            DAY_START_HOUR + index
    );


    return (
        <Paper
            variant="outlined"
            sx={{
                overflow: "hidden"
            }}
        >

            <Box
                sx={{
                    position: "relative",
                    overflowX: "auto"
                }}
            >

                <Box
                    sx={{
                        display: "flex",
                        minWidth: 700
                    }}
                >

                    {/* Time column */}

                    <Box
                        sx={{
                            width: 72,
                            flexShrink: 0
                        }}
                    >

                        <Box
                            sx={{
                                height: 48,
                                borderBottom:
                                    "1px solid",
                                borderColor:
                                    "divider"
                            }}
                        />

                        {hours.map(hour => (

                            <Box
                                key={hour}
                                sx={{
                                    height:
                                        HOUR_HEIGHT,
                                    display:
                                        "flex",
                                    justifyContent:
                                        "flex-end",
                                    pr: 1,
                                    pt: 1,
                                    borderBottom:
                                        "1px solid",
                                    borderColor:
                                        "divider"
                                }}
                            >

                                <Typography
                                    variant="caption"
                                    color="text.secondary"
                                >
                                    {String(hour)
                                        .padStart(2, "0")}:00
                                </Typography>

                            </Box>

                        ))}

                    </Box>


                    {/* Appointment timeline */}

                    <Box
                        sx={{
                            position:
                                "relative",
                            flex: 1
                        }}
                    >

                        <Box
                            sx={{
                                height: 48,
                                borderBottom:
                                    "1px solid",
                                borderColor:
                                    "divider",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                px: 2
                            }}
                        >

                            <Typography
                                variant="subtitle2"
                                fontWeight={600}
                            >
                                Agenda del día
                            </Typography>

                        </Box>


                        <Box
                            sx={{
                                position:
                                    "relative",
                                height:
                                    hours.length *
                                    HOUR_HEIGHT
                            }}
                        >

                            {hours.map(hour => (

                                <Box
                                    key={hour}
                                    sx={{
                                        height:
                                            HOUR_HEIGHT,
                                        borderBottom:
                                            "1px solid",
                                        borderColor:
                                            "divider"
                                    }}
                                />

                            ))}


                            {appointments.map(
                                appointment => (
                                    <AppointmentBlock
                                        key={
                                            appointment.id
                                        }
                                        appointment={
                                            appointment
                                        }
                                        onClick={() =>
                                            onAppointmentClick(
                                                appointment
                                            )
                                        }
                                    />
                                )
                            )}

                        </Box>

                    </Box>

                </Box>

            </Box>

        </Paper>
    );
}

interface AppointmentBlockProps {
    appointment: Appointment;
    onClick: () => void;
}


function AppointmentBlock({
    appointment,
    onClick
}: AppointmentBlockProps) {

    const start =
        new Date(
            appointment.fechaHoraInicio
        );

    const end =
        new Date(
            appointment.fechaHoraFin
        );

    const startMinutes =
        start.getHours() * 60 +
        start.getMinutes();

    const endMinutes =
        end.getHours() * 60 +
        end.getMinutes();

    const dayStartMinutes =
        DAY_START_HOUR * 60;

    const top =
        ((startMinutes - dayStartMinutes) /
            60) *
        HOUR_HEIGHT;

    const height =
        Math.max(
            ((endMinutes - startMinutes) /
                60) *
            HOUR_HEIGHT,
            72
        );


    const appearance =
        APPOINTMENT_STATUS_APPEARANCE[
            appointment.estadoId
        ] ??
        DEFAULT_APPOINTMENT_STATUS_APPEARANCE;


    return (
        <Box
            onClick={onClick}
            sx={{
                position: "absolute",
                top,
                left: 8,
                right: 8,
                height,

                p: 1.5,
                borderRadius: 1.5,

                border: "1px solid",
                borderColor:
                    appearance.borderColor,

                borderLeft: "4px solid",
                borderLeftColor:
                    appearance.accentColor,

                backgroundColor:
                    appearance.backgroundColor,

                cursor: "pointer",
                overflow: "hidden",

                transition:
                    "box-shadow 0.15s ease, background-color 0.15s ease",

                "&:hover": {
                    boxShadow: 2,
                    backgroundColor:
                        appearance.hoverBackgroundColor
                }
            }}
        >

            {/* Patient and status */}

            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                    minWidth: 0
                }}
            >
                <Typography
                    variant="subtitle2"
                    fontWeight={600}
                    noWrap
                    sx={{
                        minWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {appointment.pacienteNombre}
                </Typography>

                <Typography
                    variant="caption"
                    noWrap
                    sx={{
                        flexShrink: 0,
                        fontWeight: 600,
                        color: appearance.accentColor
                    }}
                >
                    {appointment.estado}
                </Typography>
            </Box>


            {/* Reason */}

            <Typography
                variant="caption"
                color="text.secondary"
                noWrap
                sx={{
                    display: "block",
                    mt: 0.5,
                    overflow: "hidden",
                    textOverflow: "ellipsis"
                }}
            >
                {appointment.motivo || "Cita"}
            </Typography>

        </Box>
    );
}