import {
    Box,
    Paper,
    Typography
} from "@mui/material";

import type { Appointment } from "../types/appointment.types";
import { useCurrentTime } from "../../shared/hooks/useCurrentTime";
import { isToday } from "../../shared/utils/dateUtils";
import { APPOINTMENT_STATUS_APPEARANCE, DEFAULT_APPOINTMENT_STATUS_APPEARANCE } from "../constants/appointmentStatusAppearance";

const DAY_START_HOUR = 7;
const DAY_END_HOUR = 20;
const HOUR_HEIGHT = 80;

interface DayAgendaProps {
    appointments: Appointment[];
    selectedDate: string;
    onAppointmentClick: (
        appointment: Appointment
    ) => void;
    onEmptySlotClick?: (
        time: string
    ) => void;
}


export default function DayAgenda({
    appointments,
    selectedDate,
    onAppointmentClick,
    onEmptySlotClick
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


    /*
     * Current-time indicator
     */

    const currentTime = useCurrentTime();
    const showCurrentTime = isToday(selectedDate);

    const currentMinutes =
        currentTime.getHours() * 60 +
        currentTime.getMinutes();

    const currentTimeTop =
        ((currentMinutes -
            DAY_START_HOUR * 60) /
            60) *
        HOUR_HEIGHT;

    const currentTimeVisible =
        showCurrentTime &&
        currentTimeTop >= 0 &&
        currentTimeTop <=
            (DAY_END_HOUR -
                DAY_START_HOUR) *
            HOUR_HEIGHT;

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
                                    "divider",
                                backgroundColor:
                                    "primary.main"
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
                                    {String(hour).padStart(2, "0")}
                                    :00
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

                        {/* Timeline header */}
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
                                px: 2,
                                backgroundColor:
                                    "primary.main"
                            }}
                        >

                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    gap: 1
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 22,
                                        borderRadius: 1,
                                        backgroundColor:
                                            "background.default"
                                    }}
                                />
                                <Typography
                                    variant="subtitle1"
                                    fontWeight={700}
                                    sx={{
                                        letterSpacing:
                                            0.2,
                                        color:
                                            "white"
                                    }}
                                >
                                    Agenda del Día
                                </Typography>
                            </Box>
                        </Box>


                        {/* Timeline */}
                        <Box
                            sx={{
                                position:
                                    "relative",
                                height:
                                    hours.length *
                                    HOUR_HEIGHT
                            }}
                        >

                            {/* Hour grid */}
                            {hours.map(hour => (
                                <Box
                                    key={hour}
                                    sx={{
                                        height:
                                            HOUR_HEIGHT,
                                        borderBottom:
                                            "1px solid",
                                        borderColor:
                                            "divider",
                                        cursor:
                                            onEmptySlotClick
                                                ? "pointer"
                                                : "default",

                                        "&:hover":
                                            onEmptySlotClick
                                                ? {
                                                    backgroundColor:
                                                        "action.hover"
                                                }
                                                : undefined
                                    }}

                                    onClick={() => {
                                        if (!onEmptySlotClick) {
                                            return;
                                        }
                                        const time = `${String(hour).padStart(2, "0")}:00`;
                                        onEmptySlotClick(time);
                                    }}
                                />
                            ))}


                            {/* Current time */}
                            {currentTimeVisible && (
                                <CurrentTimeIndicator
                                    top={currentTimeTop}
                                    time={currentTime}
                                />
                            )}


                            {/* Appointments */}
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


/*
 * Current-time indicator
 */

interface CurrentTimeIndicatorProps {
    top: number;
    time: Date;
}


function CurrentTimeIndicator({
    top,
    time
}: CurrentTimeIndicatorProps) {

    const formattedTime =
        new Intl.DateTimeFormat(
            "es-GT",
            {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false
            }
        ).format(time);


    return (
        <Box
            sx={{
                position: "absolute",
                top,
                left: 0,
                right: 0,
                zIndex: 10,
                pointerEvents: "none",
                display: "flex",
                alignItems: "center"
            }}
        >

            {/* Current time label */}

            <Box
                sx={{
                    px: 1,
                    py: 0.25,
                    borderRadius: 1,
                    backgroundColor:
                        "error.main",
                    color:
                        "error.contrastText",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    lineHeight: 1.4,
                    flexShrink: 0
                }}
            >
                {formattedTime}
            </Box>


            {/* Current time line */}
            <Box
                sx={{
                    flex: 1,
                    height: 2,
                    backgroundColor:
                        "error.main"
                }}
            />

        </Box>
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

    const start =new Date(appointment.fechaHoraInicio);
    const end = new Date(appointment.fechaHoraFin);

    const startMinutes =
        start.getHours() * 60 +
        start.getMinutes();

    const endMinutes =
        end.getHours() * 60 +
        end.getMinutes();

    const dayStartMinutes =
        DAY_START_HOUR * 60;

    const top =
        ((startMinutes -
            dayStartMinutes) /
            60) *
        HOUR_HEIGHT;

    const height =
        Math.max(
            ((endMinutes -
                startMinutes) /
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
                    justifyContent:
                        "space-between",
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
                        textOverflow:
                            "ellipsis"
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
                        color:
                            appearance.accentColor
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
                    textOverflow:
                        "ellipsis"
                }}
            >
                {appointment.motivo || "Cita"}
            </Typography>

        </Box>
    );
}