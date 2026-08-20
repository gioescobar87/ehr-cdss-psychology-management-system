import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleIcon from "@mui/icons-material/CheckCircle";
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
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={600} noWrap>
                  {appointment.pacienteNombre}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  {start} – {end}
                </Typography>
              </Box>

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ flexShrink: 0 }}
              >
                {appointment.tieneSesion && (
                  <CheckCircleIcon
                    fontSize="small"
                    color="success"
                    titleAccess="Sesión iniciada"
                  />
                )}

                <AppointmentStatusChip
                  statusId={appointment.estadoId}
                  label={appointment.estado}
                />
              </Stack>
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
