import { useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

interface CancellationDialogProps {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  onClose: () => void;
  onConfirm: (
    reason: string,
    solicitudPaciente: boolean,
  ) => void | Promise<void>;
}

export default function CancellationDialog({
  open,
  loading = false,
  error = null,
  onClose,
  onConfirm,
}: CancellationDialogProps) {
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [solicitudPaciente, setSolicitudPaciente] = useState<boolean | null>(
    null,
  );

  const handleClose = () => {
    if (loading) {
      return;
    }

    setMotivoCancelacion("");
    setSolicitudPaciente(null);

    onClose();
  };

  const handleSubmit = async () => {
    const motivo = motivoCancelacion.trim();

    if (!motivo || solicitudPaciente === null || loading) {
      return;
    }

    const motivoConPrefijo = `Cancelación: ${motivo}`;

    await onConfirm(motivoConPrefijo, solicitudPaciente);

    setMotivoCancelacion("");
    setSolicitudPaciente(null);
  };

  const hasInvalidReason =
    motivoCancelacion.length > 0 && !motivoCancelacion.trim();

  const canSubmit =
    Boolean(motivoCancelacion.trim()) && solicitudPaciente !== null && !loading;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Cancelar cita</DialogTitle>

      <DialogContent>
        <Alert
          severity="warning"
          sx={{
            mb: 2,
            mt: 1,
          }}
        >
          Esta acción cambiará el estado de la cita a cancelada.
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" fontWeight={600} gutterBottom>
          ¿Quién solicita la cancelación?
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
          sx={{ mb: 2 }}
        >
          <ToggleButton value={true}>Paciente</ToggleButton>
          <ToggleButton value={false}>Psicólogo</ToggleButton>
        </ToggleButtonGroup>

        <TextField
          fullWidth
          multiline
          minRows={3}
          label="Motivo de cancelación"
          value={motivoCancelacion}
          onChange={(event) => setMotivoCancelacion(event.target.value)}
          required
          error={hasInvalidReason}
          helperText={
            hasInvalidReason
              ? "El motivo de cancelación es obligatorio."
              : undefined
          }
          disabled={loading}
          autoFocus
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Volver
        </Button>

        <Button
          variant="contained"
          color="error"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {loading ? "Cancelando..." : "Confirmar cancelación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
