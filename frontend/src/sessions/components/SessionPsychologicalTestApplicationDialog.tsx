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
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

import type { Sesion } from "../types/session.types";
import type { PsychologicalTest } from "../../catalog/types/psychologicalTest.types";
import type {
  SessionPsychologicalTest,
  SessionPsychologicalTestRequest,
} from "../types/sessionPsychologicalTest.types";

import {
  useCreatePsychologicalTestApplication,
  useUpdatePsychologicalTestApplication,
} from "../hooks/useSessionPsychologicalTestMutations";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionPsychologicalTestApplicationDialogProps {
  open: boolean;
  session: Sesion;
  test: PsychologicalTest | null;
  application?: SessionPsychologicalTest | null;
  onClose: () => void;
  onSuccess?: () => void;
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

export default function SessionPsychologicalTestApplicationDialog({
  open,
  session,
  test,
  application,
  onClose,
  onSuccess,
}: SessionPsychologicalTestApplicationDialogProps) {
  const [applicationDate, setApplicationDate] = useState(
    application?.fechaAplicacion ?? getToday(),
  );

  const [attachment, setAttachment] = useState(
    application?.archivoAdjunto ?? "",
  );

  const [interpretation, setInterpretation] = useState(
    application?.interpretacion ?? "",
  );

  const createMutation = useCreatePsychologicalTestApplication();
  const updateMutation = useUpdatePsychologicalTestApplication();

  const { showSuccess } = useNotification();

  const isEditMode = Boolean(application);

  const mutation = isEditMode ? updateMutation : createMutation;

  const isPending = mutation.isPending;

  const handleClose = () => {
    if (isPending) {
      return;
    }

    onClose();
  };

  const handleSave = () => {
    if (!test || !applicationDate || isPending) {
      return;
    }

    const request: SessionPsychologicalTestRequest = {
      sesionId: session.id,
      pruebaPsicologicaId: test.id,
      fechaAplicacion: applicationDate,
      archivoAdjunto: attachment.trim() || undefined,
      interpretacion: interpretation.trim() || undefined,
    };

    if (isEditMode && application) {
      updateMutation.mutate(
        {
          id: application.id,
          request,
        },
        {
          onSuccess: () => {
            showSuccess(
              "La aplicación de la prueba psicológica fue actualizada correctamente.",
            );

            onSuccess?.();
            onClose();
          },
        },
      );

      return;
    }

    createMutation.mutate(request, {
      onSuccess: () => {
        showSuccess(
          "La aplicación de la prueba psicológica fue registrada correctamente.",
        );

        onSuccess?.();
        onClose();
      },
    });
  };

  const errorMessage = mutation.error
    ? getApiErrorMessage(mutation.error)
    : null;

  const isSaveDisabled = !test || !applicationDate || isPending;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            {isEditMode
              ? "Editar aplicación de prueba"
              : "Aplicar prueba psicológica"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? "Actualice la información clínica de esta aplicación."
              : "Registre la aplicación de la prueba seleccionada."}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          {test && (
            <Box
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="flex-start">
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
                  <PsychologyOutlinedIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {test.nombre}
                  </Typography>

                  {test.objetivoPrueba && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {test.objetivoPrueba}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          )}

          <Alert severity="info">
            <Typography variant="body2">
              Paciente: <strong>{session.pacienteNombre}</strong>
            </Typography>
          </Alert>

          <Divider />

          <TextField
            fullWidth
            required
            type="date"
            label="Fecha de aplicación"
            value={applicationDate}
            onChange={(event) => setApplicationDate(event.target.value)}
            disabled={isPending}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            inputProps={{
              max: getToday(),
            }}
            helperText="La fecha no puede ser posterior a hoy ni anterior a la fecha de la sesión."
          />

          <TextField
            fullWidth
            label="Archivo adjunto"
            value={attachment}
            onChange={(event) => setAttachment(event.target.value)}
            disabled={isPending}
            multiline
            minRows={2}
            helperText="Opcional. Puede registrar la referencia al documento o archivo asociado."
          />

          <TextField
            fullWidth
            label="Interpretación clínica"
            value={interpretation}
            onChange={(event) => setInterpretation(event.target.value)}
            disabled={isPending}
            multiline
            minRows={6}
            placeholder="Registre aquí los resultados y la interpretación clínica de la prueba."
            helperText="Incluya los resultados relevantes, hallazgos e interpretación clínica."
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
            <DescriptionOutlinedIcon fontSize="small" color="action" />

            <Typography variant="body2" color="text.secondary">
              Los resultados detallados y la interpretación clínica forman parte
              de la interpretación de esta aplicación.
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button onClick={handleClose} disabled={isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          startIcon={<CheckCircleOutlinedIcon />}
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          {isPending
            ? "Guardando..."
            : isEditMode
              ? "Guardar cambios"
              : "Registrar aplicación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
