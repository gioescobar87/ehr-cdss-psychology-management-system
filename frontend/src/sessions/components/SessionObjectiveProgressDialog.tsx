import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";

import type { Sesion } from "../types/session.types";
import type { ObjetivoTerapia } from "../types/sessionObjective.types";
import type { SeguimientoObjetivoRequest } from "../types/sessionObjective.types";

import { useCreateSeguimientoObjetivo } from "../hooks/useSeguimientoObjetivoMutations";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionObjectiveProgressDialogProps {
  open: boolean;
  session: Sesion;
  objective: ObjetivoTerapia | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function SessionObjectiveProgressDialog({
  open,
  session,
  objective,
  onClose,
  onSuccess,
}: SessionObjectiveProgressDialogProps) {
  const [progressDescription, setProgressDescription] = useState("");

  const createMutation = useCreateSeguimientoObjetivo();

  const { showSuccess } = useNotification();

  const handleClose = () => {
    if (createMutation.isPending) {
      return;
    }

    setProgressDescription("");
    onClose();
  };

  const handleSave = () => {
    if (
      !objective ||
      !progressDescription.trim() ||
      createMutation.isPending
    ) {
      return;
    }

    const request: SeguimientoObjetivoRequest = {
      objetivoTerapiaId: objective.id,
      sesionId: session.id,
      descripcionAvance: progressDescription.trim(),
    };

    createMutation.mutate(request, {
      onSuccess: () => {
        showSuccess(
          "El avance del objetivo terapéutico fue registrado correctamente.",
        );

        setProgressDescription("");

        onSuccess?.();
        onClose();
      },
    });
  };

  const errorMessage = createMutation.error
    ? getApiErrorMessage(createMutation.error)
    : null;

  const isSaveDisabled =
    !objective ||
    !progressDescription.trim() ||
    createMutation.isPending;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            Registrar avance terapéutico
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Registre el progreso observado durante esta sesión.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          {objective && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Stack
                direction="row"
                spacing={1.5}
                alignItems="flex-start"
              >
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: 1.5,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: "primary.50",
                    color: "primary.main",
                    flexShrink: 0,
                  }}
                >
                  <TrackChangesOutlinedIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Objetivo terapéutico
                  </Typography>

                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    sx={{
                      overflowWrap: "anywhere",
                    }}
                  >
                    {objective.descripcion}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          <Alert severity="info">
            <Stack spacing={0.5}>
              <Typography variant="body2">
                <strong>Paciente:</strong>{" "}
                {session.pacienteNombre}
              </Typography>

              <Typography variant="body2">
                <strong>Sesión:</strong>{" "}
                {session.fechaSesion
                  ? new Intl.DateTimeFormat("es-GT", {
                      dateStyle: "long",
                      timeStyle: "short",
                    }).format(new Date(session.fechaSesion))
                  : "Fecha no disponible"}
              </Typography>
            </Stack>
          </Alert>

          <Divider />

          <TextField
            fullWidth
            required
            multiline
            minRows={6}
            maxRows={12}
            label="Progreso de esta sesión"
            placeholder="Describa los avances observados, logros alcanzados, dificultades presentadas o cambios relevantes relacionados con este objetivo..."
            value={progressDescription}
            onChange={(event) =>
              setProgressDescription(event.target.value)
            }
            disabled={createMutation.isPending}
            inputProps={{
              maxLength: 5000,
            }}
            helperText={`${progressDescription.length}/5000 caracteres`}
          />

          <Box
            sx={{
              display: "flex",
              gap: 1.25,
              alignItems: "flex-start",
              p: 2,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
            }}
          >
            <EventOutlinedIcon
              fontSize="small"
              color="action"
            />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Este avance quedará asociado automáticamente a la sesión
              actual y al objetivo terapéutico seleccionado.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button
          onClick={handleClose}
          disabled={createMutation.isPending}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          startIcon={<CheckCircleOutlinedIcon />}
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          {createMutation.isPending
            ? "Registrando..."
            : "Registrar avance"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}