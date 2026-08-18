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
  Typography,
} from "@mui/material";

import type { Sesion } from "../types/session.types";
import type { PsychologicalTest } from "../../catalog/types/psychologicalTest.types";
import type { SessionPsychologicalTestRequest } from "../types/sessionPsychologicalTest.types";

import { useCreatePsychologicalTestApplication } from "../hooks/useSessionPsychologicalTestMutations";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface PsychologicalTestApplicationDialogProps {
  open: boolean;
  session: Sesion;
  test: PsychologicalTest | null;
  onClose: () => void;
  onBack: () => void;
}

export default function PsychologicalTestApplicationDialog({
  open,
  session,
  test,
  onClose,
  onBack,
}: PsychologicalTestApplicationDialogProps) {
  const [applicationDate, setApplicationDate] = useState("");
  const [attachment, setAttachment] = useState("");

  const createMutation = useCreatePsychologicalTestApplication();

  const { showSuccess } = useNotification();

  const handleClose = () => {
    if (createMutation.isPending) {
      return;
    }

    resetForm();
    onClose();
  };

  const handleBack = () => {
    if (createMutation.isPending) {
      return;
    }

    resetForm();
    onBack();
  };

  const resetForm = () => {
    setApplicationDate("");
    setAttachment("");
  };

  const handleSave = () => {
    if (!test || !applicationDate || createMutation.isPending) {
      return;
    }

    const request: SessionPsychologicalTestRequest = {
      sesionId: session.id,
      pruebaPsicologicaId: test.id,
      fechaAplicacion: applicationDate,
      archivoAdjunto: attachment.trim() || undefined,
    };

    createMutation.mutate(request, {
      onSuccess: () => {
        showSuccess("La prueba psicológica fue aplicada correctamente.");

        resetForm();
        onClose();
      },
    });
  };

  const errorMessage = createMutation.error
    ? getApiErrorMessage(createMutation.error)
    : null;

  const isSaveDisabled = !test || !applicationDate || createMutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Aplicar prueba psicológica</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Registre la aplicación de la prueba seleccionada para esta sesión.
          </Typography>

          <Alert severity="info">
            <Stack spacing={0.5}>
              <Typography variant="body2">
                Paciente: <strong>{session.pacienteNombre}</strong>
              </Typography>

              {test && (
                <Typography variant="body2">
                  Prueba: <strong>{test.nombre}</strong>
                </Typography>
              )}
            </Stack>
          </Alert>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <TextField
            fullWidth
            required
            type="date"
            label="Fecha de aplicación"
            value={applicationDate}
            onChange={(event) => setApplicationDate(event.target.value)}
            disabled={createMutation.isPending}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            helperText="La fecha no puede ser futura ni anterior a la fecha de la sesión."
          />

          <TextField
            fullWidth
            label="Archivo adjunto"
            value={attachment}
            onChange={(event) => setAttachment(event.target.value)}
            disabled={createMutation.isPending}
            helperText="Opcional"
            inputProps={{
              maxLength: 500,
            }}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleBack} disabled={createMutation.isPending}>
          Atrás
        </Button>

        <Button onClick={handleClose} disabled={createMutation.isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          {createMutation.isPending ? "Aplicando..." : "Aplicar prueba"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
