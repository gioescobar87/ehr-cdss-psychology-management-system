import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import type { Sesion, SessionRequest } from "../types/session.types";
import { useUpdateSession } from "../hooks/useUpdateSession";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionObservationsProps {
  session: Sesion;
}

export default function SessionObservations({
  session,
}: SessionObservationsProps) {
  const initialObservations = session.observacionesGenerales ?? "";

  const [observations, setObservations] = useState(initialObservations);
  const [savedObservations, setSavedObservations] =
    useState(initialObservations);

  const updateSessionMutation = useUpdateSession();
  const { showSuccess } = useNotification();

  const hasChanges = observations !== savedObservations;

  const handleSave = () => {
    if (!hasChanges || updateSessionMutation.isPending) {
      return;
    }

    const request: SessionRequest = {
      pacienteId: session.pacienteId,
      usuarioId: session.usuarioId,
      tipoSesionId: session.tipoSesionId,
      fechaSesion: session.fechaSesion,
      observacionesGenerales: observations.trim() || undefined,
      citaId: session.citaId,
    };

    updateSessionMutation.mutate(
      {
        id: session.id,
        request,
      },
      {
        onSuccess: (updatedSession) => {
          const savedValue = updatedSession.observacionesGenerales ?? "";

          setObservations(savedValue);
          setSavedObservations(savedValue);

          showSuccess("Las observaciones fueron guardadas correctamente.");
        },
      },
    );
  };

  const errorMessage = updateSessionMutation.error
    ? getApiErrorMessage(updateSessionMutation.error)
    : null;

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2,
            md: 3,
          },
          "&:last-child": {
            pb: {
              xs: 2,
              md: 3,
            },
          },
        }}
      >
        <Stack spacing={2.5}>
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Observaciones generales
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Registre la información clínica general correspondiente a esta
              sesión.
            </Typography>
          </Box>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <TextField
            multiline
            minRows={10}
            fullWidth
            value={observations}
            onChange={(event) => setObservations(event.target.value)}
            placeholder="Escriba aquí las observaciones generales de la sesión..."
            disabled={updateSessionMutation.isPending}
          />

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              {hasChanges
                ? "Hay cambios sin guardar."
                : "No hay cambios pendientes."}
            </Typography>

            <Button
              variant="contained"
              startIcon={<SaveOutlinedIcon />}
              onClick={handleSave}
              disabled={!hasChanges || updateSessionMutation.isPending}
            >
              {updateSessionMutation.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
