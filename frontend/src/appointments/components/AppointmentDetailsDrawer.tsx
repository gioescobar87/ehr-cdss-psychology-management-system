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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";

import { useQuery } from "@tanstack/react-query";

import type { Appointment } from "../types/appointment.types";
import { useAppointmentSession } from "../hooks/useAppointmentSession";
import { useCancelAppointment } from "../hooks/useCancelAppointment";
import { useRescheduleAppointment } from "../hooks/useRescheduleAppointment";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { getPatientById } from "../../patients/api/patientApi";

import CancellationDialog from "./CancellationDialog";
import RescheduleDialog from "./RescheduleDialog";
import PatientDetailsDialog from "../../patients/components/PatientDetailsDialog";

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

  const {
    data: patient,
    isLoading: isLoadingPatient,
  } = useQuery({
    queryKey: ["patient", appointment?.pacienteId],
    queryFn: () => getPatientById(appointment!.pacienteId),
    enabled: open && appointment !== null,
  });

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

  const isCancelled = appointment.estadoId === APPOINTMENT_STATUS.CANCELLED;

  const motivoConsulta = patient?.motivoConsulta?.trim() ?? "";

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

            {/* Motivo de consulta */}

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Motivo de consulta
              </Typography>

              {isLoadingPatient ? (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    py: 0.5,
                  }}
                >
                  <CircularProgress size={16} />
                  <Typography variant="body2" color="text.secondary">
                    Cargando motivo de consulta...
                  </Typography>
                </Box>
              ) : (
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {motivoConsulta || "No hay motivo de consulta registrado."}
                </Typography>
              )}
            </Box>

            {/* Reason */}

            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Objetivo de la sesión
              </Typography>

              <Typography variant="body1" fontWeight={500}>
                {appointment.motivo || "---"}
              </Typography>
            </Box>

            {/* Cancellation reason */}

            {isCancelled && (
              <Box>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Motivo de cancelación
                </Typography>

                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    whiteSpace: "pre-wrap",
                  }}
                >
                  {appointment.motivoCancelacion ||
                    "Sin motivo de cancelación registrado"}
                </Typography>
              </Box>
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
                    return;
                  }

                  onStartSession?.(appointment);
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
              cancelMutation.error
                ? getApiErrorMessage(cancelMutation.error)
                : null
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
