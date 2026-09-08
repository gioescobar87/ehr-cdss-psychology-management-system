import { Box, Button, Stack, Typography } from "@mui/material";
import type { Appointment } from "../../../appointments/types/appointment.types";

interface AgendaStageProps {
  appointments: Appointment[];
  weekStart: string;
  psychologistColors: Map<number, string>;
  onSelect: (appointment: Appointment) => void;
}

const START_HOUR = 7;
const END_HOUR = 20;
const HOUR_HEIGHT = 72;
const MIN_APPOINTMENT_HEIGHT = 32;
const MIN_APPOINTMENT_WIDTH = 78;
const APPOINTMENT_GAP = 4;
const TIME_COLUMN_WIDTH = 64;
const DAY_MIN_WIDTH = 170;

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join(".")
    .toUpperCase();
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat("es-GT", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

function getMinutesFromStartOfDay(dateTime: string) {
  const date = new Date(dateTime);

  return date.getHours() * 60 + date.getMinutes();
}

function getAppointmentLayout(appointments: Appointment[]): Map<
  number,
  {
    column: number;
    totalColumns: number;
  }
> {
  const layout = new Map<
    number,
    {
      column: number;
      totalColumns: number;
    }
  >();

  const sortedAppointments = [...appointments].sort(
    (a, b) =>
      new Date(a.fechaHoraInicio).getTime() -
      new Date(b.fechaHoraInicio).getTime(),
  );

  const columns: Appointment[][] = [];

  sortedAppointments.forEach((appointment) => {
    const appointmentStart = new Date(appointment.fechaHoraInicio).getTime();

    const appointmentEnd = new Date(appointment.fechaHoraFin).getTime();

    let columnIndex = columns.findIndex((column) => {
      const lastAppointment = column[column.length - 1];

      const lastAppointmentEnd = new Date(
        lastAppointment.fechaHoraFin,
      ).getTime();

      return lastAppointmentEnd <= appointmentStart;
    });

    if (columnIndex === -1) {
      columnIndex = columns.length;
      columns.push([]);
    }

    columns[columnIndex].push(appointment);

    layout.set(appointment.id, {
      column: columnIndex,
      totalColumns: 0,
    });

    const overlappingAppointments = sortedAppointments.filter((other) => {
      if (other.id === appointment.id) {
        return true;
      }

      const otherStart = new Date(other.fechaHoraInicio).getTime();

      const otherEnd = new Date(other.fechaHoraFin).getTime();

      return otherStart < appointmentEnd && otherEnd > appointmentStart;
    });

    const usedColumns = new Set<number>();

    overlappingAppointments.forEach((other) => {
      const otherLayout = layout.get(other.id);

      if (otherLayout) {
        usedColumns.add(otherLayout.column);
      }
    });

    const totalColumns = Math.max(columns.length, usedColumns.size, 1);

    overlappingAppointments.forEach((other) => {
      const otherLayout = layout.get(other.id);

      if (otherLayout) {
        otherLayout.totalColumns = Math.max(
          otherLayout.totalColumns,
          totalColumns,
        );
      }
    });
  });

  const appointmentGroups: Appointment[][] = [];

  sortedAppointments.forEach((appointment) => {
    const appointmentStart = new Date(appointment.fechaHoraInicio).getTime();

    const appointmentEnd = new Date(appointment.fechaHoraFin).getTime();

    const group = appointmentGroups.find((existingGroup) =>
      existingGroup.some((existingAppointment) => {
        const existingStart = new Date(
          existingAppointment.fechaHoraInicio,
        ).getTime();

        const existingEnd = new Date(
          existingAppointment.fechaHoraFin,
        ).getTime();

        return existingStart < appointmentEnd && existingEnd > appointmentStart;
      }),
    );

    if (group) {
      group.push(appointment);
    } else {
      appointmentGroups.push([appointment]);
    }
  });

  appointmentGroups.forEach((group) => {
    const usedColumns = new Set<number>();

    group.forEach((appointment) => {
      const appointmentLayout = layout.get(appointment.id);

      if (appointmentLayout) {
        usedColumns.add(appointmentLayout.column);
      }
    });

    const totalColumns = Math.max(usedColumns.size, 1);

    group.forEach((appointment) => {
      const appointmentLayout = layout.get(appointment.id);

      if (appointmentLayout) {
        appointmentLayout.totalColumns = totalColumns;
      }
    });
  });

  return layout;
}

function getDayAppointments(appointments: Appointment[], day: string) {
  return appointments.filter(
    (appointment) => appointment.fechaHoraInicio.slice(0, 10) === day,
  );
}

export default function AgendaStage({
  appointments,
  weekStart,
  psychologistColors,
  onSelect,
}: AgendaStageProps) {
  const weekDays = [0, 1, 2, 3, 4].map((offset) => addDays(weekStart, offset));

  const psychologistLegend = [
    ...new Map(
      appointments.map((item) => [item.usuarioId, item.usuarioNombre]),
    ),
  ];

  const timelineHeight = (END_HOUR - START_HOUR) * HOUR_HEIGHT;

  return (
    <Box sx={{ width: "100%" }}>
      <Stack direction="row" flexWrap="wrap" gap={2} sx={{ mb: 2 }}>
        {psychologistLegend.map(([id, name]) => (
          <Stack key={id} direction="row" spacing={0.75} alignItems="center">
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: psychologistColors.get(id),
                flexShrink: 0,
              }}
            />

            <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
              {name}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Box
        sx={{
          width: "100%",
          overflowX: "auto",
          overflowY: "hidden",
          borderTop: "1px solid",
          borderLeft: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: `${TIME_COLUMN_WIDTH}px repeat(5, minmax(${DAY_MIN_WIDTH}px, 1fr))`,
            minWidth: `${TIME_COLUMN_WIDTH + DAY_MIN_WIDTH * 5}px`,
          }}
        >
          <Box
            sx={{
              height: 48,
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderBottom: "1px solid",
              borderColor: "divider",
            }}
          />

          {weekDays.map((day) => (
            <Box
              key={day}
              sx={{
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                px: 1,
                bgcolor: "background.paper",
                borderRight: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  fontSize: "0.75rem",
                  textTransform: "capitalize",
                  whiteSpace: "nowrap",
                }}
              >
                {formatDay(day)}
              </Typography>
            </Box>
          ))}

          <Box
            sx={{
              position: "relative",
              height: timelineHeight,
              bgcolor: "background.paper",
              borderRight: "1px solid",
              borderColor: "divider",
            }}
          >
            {Array.from({
              length: END_HOUR - START_HOUR,
            }).map((_, index) => {
              const hour = START_HOUR + index;

              return (
                <Box
                  key={hour}
                  sx={{
                    height: HOUR_HEIGHT,
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "flex-end",
                    pt: 0.75,
                    pr: 0.75,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      fontSize: "0.66rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {hour.toString().padStart(2, "0")}:00
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {weekDays.map((day) => {
            const dayAppointments = getDayAppointments(appointments, day);

            const layout = getAppointmentLayout(dayAppointments);

            return (
              <Box
                key={day}
                sx={{
                  position: "relative",
                  height: timelineHeight,
                  minWidth: 0,
                  bgcolor: "grey.50",
                  borderRight: "1px solid",
                  borderColor: "divider",
                  overflow: "visible",
                }}
              >
                {Array.from({
                  length: END_HOUR - START_HOUR,
                }).map((_, index) => (
                  <Box
                    key={index}
                    sx={{
                      position: "absolute",
                      top: index * HOUR_HEIGHT,
                      left: 0,
                      right: 0,
                      height: HOUR_HEIGHT,
                      borderBottom: "1px solid",
                      borderColor: "divider",
                      pointerEvents: "none",
                    }}
                  />
                ))}

                {dayAppointments.map((appointment) => {
                  const appointmentStart = getMinutesFromStartOfDay(
                    appointment.fechaHoraInicio,
                  );

                  const appointmentEnd = getMinutesFromStartOfDay(
                    appointment.fechaHoraFin,
                  );

                  const timelineStart = START_HOUR * 60;

                  const top =
                    ((appointmentStart - timelineStart) / 60) * HOUR_HEIGHT;

                  const duration =
                    Math.max(appointmentEnd - appointmentStart, 15) / 60;

                  const height = Math.max(
                    duration * HOUR_HEIGHT - 4,
                    MIN_APPOINTMENT_HEIGHT,
                  );

                  const appointmentLayout = layout.get(appointment.id);

                  const column = appointmentLayout?.column ?? 0;

                  const totalColumns = appointmentLayout?.totalColumns ?? 1;

                  const psychologistColor = psychologistColors.get(
                    appointment.usuarioId,
                  );

                  const isCancelled = appointment.estado === "CANCELADA";

                  const widthPercentage = 100 / totalColumns;

                  const leftPercentage = column * widthPercentage;

                  return (
                    <Button
                      key={appointment.id}
                      onClick={() => onSelect(appointment)}
                      sx={{
                        position: "absolute",
                        top: Math.max(top + 2, 2),
                        left: `calc(${leftPercentage}% + ${APPOINTMENT_GAP / 2}px)`,
                        width: `calc(${widthPercentage}% - ${APPOINTMENT_GAP}px)`,
                        height,
                        minWidth:
                          totalColumns === 1 ? 0 : MIN_APPOINTMENT_WIDTH,
                        display: "block",
                        textAlign: "left",
                        textTransform: "none",
                        p: 0.5,
                        borderLeft: `3px solid ${psychologistColor}`,
                        bgcolor: isCancelled ? "error.50" : "background.paper",
                        color: "text.primary",
                        boxShadow: 1,
                        borderRadius: 0.75,
                        overflow: "hidden",
                        zIndex: 2,
                        justifyContent: "flex-start",
                        alignItems: "flex-start",
                        "&:hover": {
                          bgcolor: isCancelled ? "error.100" : "action.hover",
                        },
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          display: "block",
                          fontWeight: 800,
                          fontSize: "0.61rem",
                          lineHeight: 1.15,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {initials(appointment.pacienteNombre)}
                      </Typography>

                      {isCancelled && (
                        <Typography
                          variant="caption"
                          color="error"
                          sx={{
                            display: "block",
                            fontSize: "0.55rem",
                            lineHeight: 1.15,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          CANCELADA
                        </Typography>
                      )}
                    </Button>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
