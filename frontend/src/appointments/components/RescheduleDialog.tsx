import { useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import {
  combineDateAndTime,
  toDateInputValue,
} from "../../shared/utils/dateUtils";

interface RescheduleDialogProps {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (values: {
    motivo: string;
    solicitudPaciente: boolean;
    nuevaFechaHoraInicio: string;
  }) => void | Promise<void>;
}

export default function RescheduleDialog({
  open,
  loading = false,
  error = null,
  onClose,
  onConfirm,
}: RescheduleDialogProps) {
  const [motivo, setMotivo] = useState("");
  const [solicitudPaciente, setSolicitudPaciente] = useState<boolean | null>(
    null,
  );
  const [date, setDate] = useState(toDateInputValue(new Date()));
  const [startTime, setStartTime] = useState("08:00");

  const reset = () => {
    setMotivo("");
    setSolicitudPaciente(null);
    setDate(toDateInputValue(new Date()));
    setStartTime("08:00");
  };

  const handleClose = () => {
    if (loading) {
      return;
    }

    reset();
    onClose();
  };

  const canSubmit =
    Boolean(motivo.trim()) &&
    solicitudPaciente !== null &&
    Boolean(date) &&
    Boolean(startTime) &&
    !loading;

  const handleSubmit = async () => {
    if (!canSubmit || solicitudPaciente === null) {
      return;
    }

    await onConfirm({
      motivo: motivo.trim(),
      solicitudPaciente,
      nuevaFechaHoraInicio: combineDateAndTime(date, startTime),
    });

    reset();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Reagendar cita</DialogTitle>

      <DialogContent>
        <Alert severity="info" sx={{ mb: 2, mt: 1 }}>
          La cita actual se cancelará y se creará una nueva con la fecha y hora
          indicadas.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2.5}>
          <Stack spacing={1}>
            <Typography variant="body2" fontWeight={600}>
              ¿Quién solicita la reprogramación?
            </Typography>

            <ToggleButtonGroup
              value={solicitudPaciente}
              exclusive
              size="small"
              disabled={loading}
              onChange={(_event, value: boolean | null) => {
                if (value !== null) {
                  setSolicitudPaciente(value);
                }
              }}
            >
              <ToggleButton value={true}>Paciente</ToggleButton>
              <ToggleButton value={false}>Psicólogo</ToggleButton>
            </ToggleButtonGroup>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <TextField
              label="Nueva fecha"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              disabled={loading}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Nueva hora de inicio"
              type="time"
              value={startTime}
              onChange={(event) => setStartTime(event.target.value)}
              disabled={loading}
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
            />
          </Stack>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Motivo de la reprogramación"
            value={motivo}
            onChange={(event) => setMotivo(event.target.value)}
            required
            disabled={loading}
          />
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Volver
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? "Reagendando..." : "Confirmar reprogramación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
