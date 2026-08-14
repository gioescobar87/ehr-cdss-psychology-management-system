import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import type { Appointment } from "../types/appointment.types";
import AppointmentStatusChip from "./AppointmentStatusChip";

import { formatAppointmentTime } from "../../shared/utils/dateUtils";

interface AppointmentCardProps {
  appointment: Appointment;
  onClick: (appointment: Appointment) => void;
}

export default function AppointmentCard({
  appointment,
  onClick,
}: AppointmentCardProps) {
  const start = formatAppointmentTime(appointment.fechaHoraInicio);

  const end = formatAppointmentTime(appointment.fechaHoraFin);

  const cancelled = appointment.estadoId === 7;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
        opacity: cancelled ? 0.65 : 1,
      }}
    >
      <CardActionArea onClick={() => onClick(appointment)}>
        <CardContent>
          <Stack spacing={1.5}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
              }}
            >
              <Box>
                <Typography variant="subtitle1" fontWeight={600}>
                  {appointment.pacienteNombre}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {start} – {end}
                </Typography>
              </Box>

              <AppointmentStatusChip
                statusId={appointment.estadoId}
                label={appointment.estado}
              />
            </Box>

            {appointment.motivo && (
              <Typography variant="body2" color="text.secondary">
                {appointment.motivo}
              </Typography>
            )}
          </Stack>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
