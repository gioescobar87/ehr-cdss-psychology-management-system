import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NotesIcon from "@mui/icons-material/Notes";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";

import type { Appointment } from "../types/appointment.types";
import { useAppointmentSession } from "../hooks/useAppointmentSession";
import { useCancelAppointment } from "../hooks/useCancelAppointment";
import { useRescheduleAppointment } from "../hooks/useRescheduleAppointment";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import CancellationDialog from "./CancellationDialog";
import RescheduleDialog from "./RescheduleDialog";
import PatientDetailsDialog from "../../patients/components/PatientDetailsDialog";

import {
  APPOINTMENT_STATUS_APPEARANCE,
  DEFAULT_APPOINTMENT_STATUS_APPEARANCE,
} from "../constants/appointmentStatusAppearance";

interface AppointmentDetailsDrawerProps {
  open: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  coordinatorReadOnly?: boolean;
  onStartSession?: (appointment: Appointment) => void;
  onOpenSession?: (sessionId: number) => void;
}

export default function AppointmentDetailsDrawer({
  open,
  appointment,
  onClose,
  coordinatorReadOnly = false,
  onStartSession,
  onOpenSession,
}: AppointmentDetailsDrawerProps) {
  const {
    data: session,
    isLoading: isLoadingSession,
    isError: isSessionError,
  } = useAppointmentSession(appointment?.id, open);

  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [actionsAnchorEl, setActionsAnchorEl] = useState<HTMLElement | null>(
    null,
  );
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false);

  const cancelMutation = useCancelAppointment();
  const rescheduleMutation = useRescheduleAppointment();

  if (!appointment) {
    return null;
  }

  const appearance =
    APPOINTMENT_STATUS_APPEARANCE[appointment.estadoId] ??
    DEFAULT_APPOINTMENT_STATUS_APPEARANCE;

  const isCancelled = appointment.estadoId === APPOINTMENT_STATUS.CANCELLED;

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

  const handleCancelConfirm = async (
    reason: string,
    solicitudPaciente: boolean,
  ) => {
    try {
      await cancelMutation.mutateAsync({
        id: appointment.id,
        request: {
          motivoCancelacion: reason,
          solicitudPaciente,
        },
      });

      setCancelDialogOpen(false);
      onClose();
    } catch {
      // Error is displayed in the dialog.
    }
  };

  const handleRescheduleConfirm = async (values: {
    motivo: string;
    solicitudPaciente: boolean;
    nuevaFechaHoraInicio: string;
  }) => {
    try {
      await rescheduleMutation.mutateAsync({
        id: appointment.id,
        request: {
          motivoCancelacion: values.motivo,
          solicitudPaciente: values.solicitudPaciente,
          nuevaFechaHoraInicio: values.nuevaFechaHoraInicio,
        },
      });

      setRescheduleDialogOpen(false);
      onClose();
    } catch {
      // Error is displayed in the dialog.
    }
  };

  return (
    <>
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
                onClick={() => setPatientDialogOpen(true)}
                fullWidth
              >
                Ver paciente
              </Button>

              <Button
                variant="contained"
                startIcon={
                  isLoadingSession ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : (
                    <OpenInNewIcon />
                  )
                }
                onClick={() => {
                  if (session) {
                    onOpenSession?.(session.id);
                  }
                }}
                disabled={
                  isLoadingSession ||
                  isSessionError ||
                  (coordinatorReadOnly
                    ? !session || !onOpenSession
                    : (!session && !onStartSession) ||
                      (session !== null && !onOpenSession))
                }
                fullWidth
              >
                {isLoadingSession
                  ? "Verificando sesión..."
                  : coordinatorReadOnly
                    ? "Ver última sesión terapéutica"
                    : session
                      ? "Abrir sesión terapéutica"
                      : "Iniciar sesión terapéutica"}
              </Button>

              {!coordinatorReadOnly && (
                <Button
                  variant="text"
                  startIcon={<MoreVertIcon />}
                  fullWidth
                  disabled={isCancelled}
                  sx={{
                    justifyContent: "flex-start",
                  }}
                  onClick={(event) => setActionsAnchorEl(event.currentTarget)}
                >
                  Más acciones
                </Button>
              )}
            </Stack>
          </Stack>
        </Box>
      </Drawer>

      {!coordinatorReadOnly && (
        <Menu
          anchorEl={actionsAnchorEl}
          open={Boolean(actionsAnchorEl)}
          onClose={() => setActionsAnchorEl(null)}
        >
        <MenuItem
          onClick={() => {
            setActionsAnchorEl(null);
            setRescheduleDialogOpen(true);
          }}
        >
          <EventRepeatOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} />
          Reagendar cita
        </MenuItem>

        <MenuItem
          onClick={() => {
            setActionsAnchorEl(null);
            setCancelDialogOpen(true);
          }}
        >
          <CancelOutlinedIcon fontSize="small" sx={{ mr: 1.5 }} />
          Cancelar cita
        </MenuItem>
        </Menu>
      )}

      <PatientDetailsDialog
        open={patientDialogOpen}
        patientId={appointment.pacienteId}
        onClose={() => setPatientDialogOpen(false)}
      />

      {!coordinatorReadOnly && (
        <>
          <CancellationDialog
            open={cancelDialogOpen}
            loading={cancelMutation.isPending}
            error={
              cancelMutation.error ? getApiErrorMessage(cancelMutation.error) : null
            }
            onClose={() => {
              setCancelDialogOpen(false);
              cancelMutation.reset();
            }}
            onConfirm={handleCancelConfirm}
          />

          <RescheduleDialog
            open={rescheduleDialogOpen}
            loading={rescheduleMutation.isPending}
            error={
              rescheduleMutation.error
                ? getApiErrorMessage(rescheduleMutation.error)
                : null
            }
            onClose={() => {
              setRescheduleDialogOpen(false);
              rescheduleMutation.reset();
            }}
            onConfirm={handleRescheduleConfirm}
          />
        </>
      )}
    </>
  );
}
