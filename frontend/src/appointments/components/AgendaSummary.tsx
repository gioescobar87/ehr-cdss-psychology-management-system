import EventIcon from "@mui/icons-material/Event";
import type { ReactNode } from "react";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";
import { isToday, formatAppointmentTime } from "../../shared/utils/dateUtils";
import { useCurrentTime } from "../../shared/hooks/useCurrentTime";

import { Box, Paper, Stack, Typography } from "@mui/material";

import type { Appointment } from "../types/appointment.types";

interface AgendaSummaryProps {
  appointments: Appointment[];
  selectedDate: string;
}

export default function AgendaSummary({
  appointments,
  selectedDate,
}: AgendaSummaryProps) {
  const total = appointments.length;

  const currentTime = useCurrentTime();

  const sortedAppointments = [...appointments].sort(
    (a, b) =>
      new Date(a.fechaHoraInicio).getTime() -
      new Date(b.fechaHoraInicio).getTime(),
  );

  const nextAppointment = isToday(selectedDate)
    ? sortedAppointments.find(
        (appointment) =>
          appointment.estadoId !== APPOINTMENT_STATUS.CANCELLED &&
          appointment.estadoId !== APPOINTMENT_STATUS.COMPLETED &&
          appointment.estadoId !== APPOINTMENT_STATUS.NO_SHOW &&
          new Date(appointment.fechaHoraFin).getTime() >= currentTime.getTime(),
      )
    : undefined;

  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ mb: 3 }}
      alignItems={{ md: "stretch" }}
    >
      <Box sx={{ flex: { md: nextAppointment ? "0 0 260px" : 1 } }}>
        <SummaryCard icon={<EventIcon />} value={total} label="Citas hoy" />
      </Box>

      {nextAppointment && (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            flex: 1,
            borderColor: "primary.main",
            backgroundColor: "primary.50",
            borderLeft: "4px solid",
            borderLeftColor: "primary.main",
          }}
        >
          <Typography variant="caption" color="text.secondary">
            Próxima cita
          </Typography>

          <Typography variant="h6" fontWeight={600}>
            {nextAppointment.pacienteNombre}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {formatAppointmentTime(nextAppointment.fechaHoraInicio)}

            {" – "}

            {formatAppointmentTime(nextAppointment.fechaHoraFin)}
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

function SummaryCard({ icon, value, label }: SummaryCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: "100%",
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="h4" fontWeight={600} lineHeight={1}>
            {value}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            {label}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}
