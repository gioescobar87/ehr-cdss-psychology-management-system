import { useEffect, useState } from "react";

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

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
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

export default function SessionPsychologicalTestApplicationDialog({
  open,
  session,
  test,
  application,
  onClose,
  onSuccess,
}: SessionPsychologicalTestApplicationDialogProps) {
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

  useEffect(() => {
    if (open) {
      setAttachment(application?.archivoAdjunto ?? "");
      setInterpretation(application?.interpretacion ?? "");
    }
  }, [open, application]);

  const handleClose = () => {
    if (isPending) {
      return;
    }

    onClose();
  };

  const handleSave = () => {
    if (!test || isPending) {
      return;
    }

    const request: SessionPsychologicalTestRequest = {
      sesionId: session.id,
      pruebaPsicologicaId: test.id,
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

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            {isEditMode
              ? "Editar aplicación de prueba"
              : "Registrar aplicación de prueba"}
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {isEditMode
              ? "Actualice la información clínica asociada a esta aplicación."
              : "Registre la información correspondiente a la aplicación de la prueba."}
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          {test && (
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
                  <PsychologyOutlinedIcon />
                </Box>

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                  >
                    {test.nombre}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    {test.objetivoPrueba}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          )}

          <TextField
            fullWidth
            label="Archivo adjunto"
            value={attachment}
            onChange={(event) => setAttachment(event.target.value)}
            disabled={isPending}
            multiline
            minRows={2}
            placeholder="Referencia al documento o archivo asociado"
            helperText="Opcional. Registre una referencia al documento o archivo relacionado con la aplicación."
          />

          <TextField
            fullWidth
            label="Interpretación clínica"
            value={interpretation}
            onChange={(event) =>
              setInterpretation(event.target.value)
            }
            disabled={isPending}
            multiline
            minRows={7}
            placeholder="Registre los resultados relevantes, hallazgos e interpretación clínica."
            helperText="Opcional. Puede completar o actualizar esta información posteriormente."
          />

        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button
          onClick={handleClose}
          disabled={isPending}
        >
          Cancelar
        </Button>

        <Button
          variant="contained"
          startIcon={<CheckCircleOutlinedIcon />}
          onClick={handleSave}
          disabled={!test || isPending}
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
