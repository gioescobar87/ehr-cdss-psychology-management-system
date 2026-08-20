import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotesIcon from "@mui/icons-material/Notes";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { CircularProgress } from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";

import type { Appointment } from "../types/appointment.types";
import { useAppointmentSession } from "../hooks/useAppointmentSession";

import {
  APPOINTMENT_STATUS_APPEARANCE,
  DEFAULT_APPOINTMENT_STATUS_APPEARANCE,
} from "../constants/appointmentStatusAppearance";

interface AppointmentDetailsDrawerProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onOpenPatient?: (appointment: Appointment) => void;
  onStartSession?: (appointment: Appointment) => void;
  onOpenSession?: (sessionId: number) => void;
}

export default function AppointmentDetailsDrawer({
  open,
  appointment,
  onClose,
  onOpenPatient,
  onStartSession,
  onOpenSession,
}: AppointmentDetailsDrawerProps) {
  const {
    data: session,
    isLoading: isLoadingSession,
    isError: isSessionError,
  } = useAppointmentSession(appointment?.id, open);

  if (!appointment) {
    return null;
  }

  const appearance =
    APPOINTMENT_STATUS_APPEARANCE[appointment.estadoId] ??
    DEFAULT_APPOINTMENT_STATUS_APPEARANCE;

  const start = new Date(appointment.fechaHoraInicio);

  const end = new Date(appointment.fechaHoraFin);

  const formattedDate = new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(start);

  const formattedStartTime = new Intl.DateTimeFormat("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(start);

  const formattedEndTime = new Intl.DateTimeFormat("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(end);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: {
              xs: "100%",
              sm: 420,
            },
            maxWidth: "100%",
          },
        },
      }}
    >
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2.5,
          py: 1.5,
        }}
      >
        <Typography variant="h6" fontWeight={700}>
          Detalles de la cita
        </Typography>

        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      {/* Content */}

      <Box
        sx={{
          p: 2.5,
        }}
      >
        <Stack spacing={2.5}>
          {/* Patient */}

          <Box>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <PersonIcon color="action" />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Paciente
                </Typography>

                <Typography variant="h6" fontWeight={700}>
                  {appointment.pacienteNombre}
                </Typography>
              </Box>
            </Stack>
          </Box>

          {/* Date and time */}

          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              <EventIcon color="action" />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Fecha
                </Typography>

                <Typography variant="body1" fontWeight={600}>
                  {formattedDate}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              <AccessTimeIcon color="action" />

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Horario
                </Typography>

                <Typography variant="body1" fontWeight={600}>
                  {formattedStartTime}
                  {" – "}
                  {formattedEndTime}
                </Typography>
              </Box>
            </Stack>
          </Stack>

          {/* Reason */}

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Motivo
            </Typography>

            <Typography variant="body1" fontWeight={500}>
              {appointment.motivo || "Sin motivo registrado"}
            </Typography>
          </Box>

          {/* Status */}

          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Estado
            </Typography>

            <Box
              component="span"
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 1.25,
                py: 0.5,
                borderRadius: 1,
                backgroundColor: appearance.backgroundColor,
                border: "1px solid",
                borderColor: appearance.borderColor,
                color: appearance.accentColor,
                fontSize: "0.8rem",
                fontWeight: 700,
              }}
            >
              {appointment.estado}
            </Box>
          </Box>

          <Divider />

          {/* Observations */}

          <Box>
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
              sx={{ mb: 1 }}
            >
              <NotesIcon fontSize="small" color="action" />

              <Typography variant="body2" color="text.secondary">
                Observaciones
              </Typography>
            </Stack>

            <Typography
              variant="body1"
              sx={{
                whiteSpace: "pre-wrap",
              }}
            >
              {appointment.observaciones || "Sin observaciones registradas."}
            </Typography>
          </Box>

          {/* If Session validation fails */}

          {isSessionError && (
            <Typography variant="body2" color="error">
              No fue posible verificar si esta cita tiene una sesión clínica.
            </Typography>
          )}

          {/* Actions */}

          <Stack spacing={1.5} sx={{ pt: 1 }}>
            <Button
              variant="outlined"
              startIcon={<PersonIcon />}
              onClick={() => onOpenPatient?.(appointment)}
              disabled={!onOpenPatient}
              fullWidth
            >
              Ver paciente
            </Button>

            <Button
              variant="contained"
              startIcon={
                isLoadingSession ? (
                  <CircularProgress size={18} color="inherit" />
                ) : session ? (
                  <OpenInNewIcon />
                ) : (
                  <PlayArrowIcon />
                )
              }
              onClick={() => {
                if (session) {
                  onOpenSession?.(session.id);
                  return;
                }

                onStartSession?.(appointment);
              }}
              disabled={
                isLoadingSession ||
                isSessionError ||
                (!session && !onStartSession) ||
                (session !== null && !onOpenSession)
              }
              fullWidth
            >
              {isLoadingSession
                ? "Verificando sesión..."
                : session
                  ? "Abrir sesión terapéutica"
                  : "Iniciar sesión terapéutica"}
            </Button>

            <Button
              variant="text"
              startIcon={<MoreVertIcon />}
              fullWidth
              sx={{
                justifyContent: "flex-start",
              }}
            >
              Más acciones
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Drawer>
  );
}
