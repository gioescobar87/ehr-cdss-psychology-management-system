import { useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

interface PatientMotivoConsultaDialogProps {
  open: boolean;
  initialValue?: string | null;
  loading?: boolean;
  error?: string | null;
  readOnly?: boolean;
  onClose: () => void;
  onConfirm: (motivoInicio: string) => void | Promise<void>;
}

export default function PatientMotivoConsultaDialog({
  open,
  initialValue,
  loading = false,
  error = null,
  readOnly = false,
  onClose,
  onConfirm,
}: PatientMotivoConsultaDialogProps) {
  const [motivoInicio, setMotivoInicio] = useState(initialValue ?? "");

  const displayedValue = readOnly ? (initialValue ?? "") : motivoInicio;

  const canSubmit = Boolean(motivoInicio.trim()) && !loading && !readOnly;

  const handleSubmit = async () => {
    if (!canSubmit) {
      return;
    }

    await onConfirm(motivoInicio.trim());
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        {readOnly ? "Motivo de consulta" : "Registrar motivo de consulta"}
      </DialogTitle>

      <DialogContent>
        <Alert severity={readOnly ? "success" : "info"} sx={{ mb: 2, mt: 1 }}>
          {readOnly
            ? "Este es el motivo de consulta registrado en el expediente clínico del paciente."
            : "Registra el motivo principal por el cual el paciente inicia su atención psicológica. Esta información será parte de su expediente clínico."}
        </Alert>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus={!readOnly}
          fullWidth
          multiline
          minRows={4}
          label="Motivo de consulta"
          placeholder={
            readOnly
              ? undefined
              : "Describe el motivo principal por el que el paciente solicita atención..."
          }
          value={displayedValue}
          onChange={(event) => setMotivoInicio(event.target.value)}
          disabled={loading}
          slotProps={{
            input: {
              readOnly,
            },
          }}
          required={!readOnly}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cerrar
        </Button>

        {!readOnly && (
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={!canSubmit}
          >
            {loading ? "Guardando..." : "Guardar motivo"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
