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
import { APPOINTMENT_STATUS } from "../../appointments/constants/appointmentStatus";
import {
  combineDateAndTime,
  toDateInputValue,
} from "../../shared/utils/dateUtils";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useAuth } from "../../auth/hooks/useAuth";
import type { Sesion } from "../types/session.types";

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
  const { user } = useAuth();

  const timeError = Boolean(startTime && endTime && endTime <= startTime);
  const canSave =
    Boolean(date && startTime && endTime && objective.trim()) &&
    !timeError &&
    !mutation.isPending &&
    Boolean(user?.id);

  const handleClose = () => {
    if (!mutation.isPending) setOpen(false);
  };

  const handleSave = async () => {
    if (!canSave || !user?.id) return;
    try {
      await mutation.mutateAsync({
        pacienteId: session.pacienteId,
        usuarioId: user.id,
        fechaHoraInicio: combineDateAndTime(date, startTime),
        fechaHoraFin: combineDateAndTime(date, endTime),
        motivo: objective.trim(),
        estadoId: APPOINTMENT_STATUS.SCHEDULED,
      });
      setObjective("");
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
            onClick={() => setOpen(true)}
          >
            Programar cita
          </Button>
        </Box>
      </Stack>

      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Programar próxima cita</DialogTitle>
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
              disabled={mutation.isPending}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Hora de inicio"
                type="time"
                value={startTime}
                onChange={(event) => setStartTime(event.target.value)}
                disabled={mutation.isPending}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                label="Hora de finalización"
                type="time"
                value={endTime}
                onChange={(event) => setEndTime(event.target.value)}
                disabled={mutation.isPending}
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
              disabled={mutation.isPending}
              required
              fullWidth
              multiline
              minRows={2}
              inputProps={{ maxLength: 255 }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button variant="contained" onClick={handleSave} disabled={!canSave}>
            {mutation.isPending ? "Guardando..." : "Guardar cita"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
