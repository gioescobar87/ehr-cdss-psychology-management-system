import { Box, Button, Stack, Typography } from "@mui/material";
import type { Appointment } from "../../../appointments/types/appointment.types";

interface AgendaStageProps {
  appointments: Appointment[];
  weekStart: string;
  psychologistColors: Map<number, string>;
  onSelect: (appointment: Appointment) => void;
}

const SLOT_MINUTES = 30;
const START_HOUR = 7;
const END_HOUR = 20;

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

function getTimeSlots() {
  const slots: string[] = [];

  for (
    let minutes = START_HOUR * 60;
    minutes < END_HOUR * 60;
    minutes += SLOT_MINUTES
  ) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    slots.push(
      `${hours.toString().padStart(2, "0")}:${mins
        .toString()
        .padStart(2, "0")}`,
    );
  }

  return slots;
}

function getAppointmentTime(appointment: Appointment) {
  const date = new Date(appointment.fechaHoraInicio);

  return {
    hours: date.getHours(),
    minutes: date.getMinutes(),
  };
}

function getSlotKey(hours: number, minutes: number) {
  const normalizedMinutes =
    Math.floor(minutes / SLOT_MINUTES) * SLOT_MINUTES;

  return `${hours.toString().padStart(2, "0")}:${normalizedMinutes
    .toString()
    .padStart(2, "0")}`;
}

const TIME_SLOTS = getTimeSlots();

export default function AgendaStage({
  appointments,
  weekStart,
  psychologistColors,
  onSelect,
}: AgendaStageProps) {
  const weekDays = [0, 1, 2, 3, 4].map((offset) =>
    addDays(weekStart, offset),
  );

  const appointmentsBySlot = new Map<string, Appointment[]>();

  appointments.forEach((appointment) => {
    const appointmentDate = appointment.fechaHoraInicio.slice(0, 10);
    const { hours, minutes } = getAppointmentTime(appointment);

    const slotKey = getSlotKey(hours, minutes);
    const key = `${appointmentDate}-${slotKey}`;

    const current = appointmentsBySlot.get(key) ?? [];
    current.push(appointment);
    appointmentsBySlot.set(key, current);
  });

  return (
    <Box sx={{ width: "100%", overflowX: "auto" }}>
      <Stack
        direction="row"
        flexWrap="wrap"
        gap={2}
        sx={{ mb: 2 }}
      >
        {[
          ...new Map(
            appointments.map((item) => [
              item.usuarioId,
              item.usuarioNombre,
            ]),
          ),
        ].map(([id, name]) => (
          <Stack
            key={id}
            direction="row"
            spacing={0.75}
            alignItems="center"
          >
            <Box
              sx={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                bgcolor: psychologistColors.get(id),
                flexShrink: 0,
              }}
            />

            <Typography
              variant="caption"
              sx={{ fontSize: "0.7rem" }}
            >
              {name}
            </Typography>
          </Stack>
        ))}
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "64px repeat(5, minmax(150px, 1fr))",
            md: "72px repeat(5, minmax(170px, 1fr))",
          },
          minWidth: 820,
          borderTop: "1px solid",
          borderLeft: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            minHeight: 48,
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
              minHeight: 48,
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
              }}
            >
              {new Intl.DateTimeFormat("es-GT", {
                weekday: "short",
                day: "numeric",
                month: "short",
              }).format(new Date(`${day}T00:00:00`))}
            </Typography>
          </Box>
        ))}

        {TIME_SLOTS.map((time) => (
          <Box key={time} sx={{ display: "contents" }}>
            <Box
              sx={{
                minHeight: 58,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                pt: 0.75,
                pr: 1,
                bgcolor: "background.paper",
                borderRight: "1px solid",
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "0.68rem",
                  whiteSpace: "nowrap",
                }}
              >
                {time}
              </Typography>
            </Box>

            {weekDays.map((day) => {
              const key = `${day}-${time}`;
              const slotAppointments =
                appointmentsBySlot.get(key) ?? [];

              return (
                <Box
                  key={key}
                  sx={{
                    minHeight: 58,
                    p: 0.5,
                    bgcolor: "grey.50",
                    borderRight: "1px solid",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(3, minmax(0, 1fr))",
                      gap: 0.5,
                      alignItems: "stretch",
                    }}
                  >
                    {slotAppointments.map((appointment) => {
                      const psychologistColor =
                        psychologistColors.get(
                          appointment.usuarioId,
                        );

                      const isCancelled =
                        appointment.estado === "CANCELADA";

                      return (
                        <Button
                          key={appointment.id}
                          onClick={() => onSelect(appointment)}
                          sx={{
                            width: "100%",
                            minWidth: 0,
                            minHeight: 42,
                            display: "block",
                            textAlign: "left",
                            textTransform: "none",
                            p: 0.5,
                            borderLeft: `3px solid ${psychologistColor}`,
                            bgcolor: "background.paper",
                            color: "text.primary",
                            boxShadow: 1,
                            borderRadius: 0.75,
                            overflow: "hidden",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              fontWeight: 800,
                              fontSize: "0.62rem",
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
                                fontSize: "0.56rem",
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
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}