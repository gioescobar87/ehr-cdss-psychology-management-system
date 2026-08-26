import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import { useCreateAppointment } from "../../appointments/hooks/useCreateAppointment";
import { useUpdateAppointment } from "../../appointments/hooks/useUpdateAppointment";
import { useAppointment } from "../../appointments/hooks/useAppointment";
import { APPOINTMENT_STATUS } from "../../appointments/constants/appointmentStatus";
import {
  combineDateAndTime,
  toDateInputValue,
} from "../../shared/utils/dateUtils";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useAuth } from "../../auth/hooks/useAuth";
import type { Sesion } from "../types/session.types";
import type {
  Appointment,
  AppointmentRequest,
} from "../../appointments/types/appointment.types";

interface NextAppointmentProps {
  session: Sesion;
}

export default function NextAppointment({ session }: NextAppointmentProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(toDateInputValue(new Date()));
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("09:00");
  const [objective, setObjective] = useState("");
  const mutation = useCreateAppointment();
  const updateMutation = useUpdateAppointment();
  const { data: linkedAppointment } = useAppointment(session.citaId);
  const [scheduledAppointment, setScheduledAppointment] =
    useState<Appointment | null>(null);
  const { user } = useAuth();

  const appointment = scheduledAppointment ?? linkedAppointment ?? null;
  const isEditing = appointment !== null;
  const isPending = mutation.isPending || updateMutation.isPending;
  const timeError = Boolean(startTime && endTime && endTime <= startTime);
  const canSave =
    Boolean(date && startTime && endTime && objective.trim()) &&
    !timeError &&
    !isPending &&
    Boolean(user?.id);

  const openDialog = () => {
    if (appointment) {
      setDate(appointment.fechaHoraInicio.slice(0, 10));
      setStartTime(appointment.fechaHoraInicio.slice(11, 16));
      setEndTime(appointment.fechaHoraFin.slice(11, 16));
      setObjective(appointment.motivo ?? "");
    }
    setOpen(true);
  };

  const handleClose = () => {
    if (!isPending) setOpen(false);
  };

  const handleSave = async () => {
    if (!canSave || !user?.id) return;
    try {
      const request: AppointmentRequest = {
        pacienteId: session.pacienteId,
        usuarioId: user.id,
        fechaHoraInicio: combineDateAndTime(date, startTime),
        fechaHoraFin: combineDateAndTime(date, endTime),
        motivo: objective.trim(),
        estadoId: APPOINTMENT_STATUS.SCHEDULED,
      };
      const saved = appointment
        ? await updateMutation.mutateAsync({ id: appointment.id, request })
        : await mutation.mutateAsync(request);
      setScheduledAppointment(saved);
      setOpen(false);
    } catch {
      // The mutation error is displayed in the dialog.
    }
  };

  return (
    <>
      <Stack spacing={2}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
            pb: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <EventOutlinedIcon color="primary" />
              <Typography variant="h5" fontWeight={700}>
                Próxima cita
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Programe la próxima cita del paciente.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<EventOutlinedIcon />}
            onClick={openDialog}
            disabled={isPending}
          >
            {appointment ? "Editar cita" : "Programar cita"}
          </Button>
        </Box>
        {appointment && (
          <Box sx={{ py: 1.5, borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="body1" fontWeight={700}>
              {appointment.motivo || "Cita programada"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {appointment.fechaHoraInicio.replace("T", " ")} -{" "}
              {appointment.fechaHoraFin.slice(11, 16)}
            </Typography>
          </Box>
        )}
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>
          {isEditing ? "Editar próxima cita" : "Programar próxima cita"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            {mutation.isError && (
              <Alert severity="error">
                {getApiErrorMessage(mutation.error)}
              </Alert>
            )}
            {!user?.id && (
              <Alert severity="error">
                No fue posible identificar al psicólogo actual.
              </Alert>
            )}
            <TextField
              label="Día de la próxima cita"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={isPending}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Hora de inicio"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                disabled={isPending}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Hora de finalización"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                disabled={isPending}
                error={timeError}
                helperText={
                  timeError
                    ? "La hora de finalización debe ser posterior a la de inicio."
                    : undefined
                }
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Stack>
            <TextField
              label="Objetivo de la próxima cita"
              value={objective}
              onChange={(event) => setObjective(event.target.value)}
              disabled={isPending}
              required
              fullWidth
              multiline
              minRows={2}
              inputProps={{ maxLength: 255 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={!canSave}>
            {isPending
              ? "Guardando..."
              : isEditing
                ? "Guardar cambios"
                : "Guardar cita"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
