import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";

import type { Sesion } from "../types/session.types";
import type { SessionIntervention } from "../types/sessionIntervention.types";

import { useSessionInterventions } from "../hooks/useSessionIntervention";
import { useDeleteSessionIntervention } from "../hooks/useSessionInterventionMutations";

import SessionInterventionDialog from "./SessionInterventionDialog";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionInterventionsProps {
  session: Sesion;
  allowCreate?: boolean;
}

export default function SessionInterventions({
  session,
  allowCreate = true,
}: SessionInterventionsProps) {
  const {
    data: interventions = [],
    isLoading,
    isError,
  } = useSessionInterventions(session.id);

  const deleteMutation = useDeleteSessionIntervention();
  const { showSuccess } = useNotification();

  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRemove = (intervention: SessionIntervention) => {
    if (deleteMutation.isPending) {
      return;
    }

    deleteMutation.mutate(
      {
        id: intervention.id,
        sessionId: session.id,
      },
      {
        onSuccess: () => {
          showSuccess("La intervención fue retirada de la sesión.");
        },
      },
    );
  };

  const deleteError = deleteMutation.error
    ? getApiErrorMessage(deleteMutation.error)
    : null;

  if (isLoading) {
    return (
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent
          sx={{
            minHeight: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card variant="outlined" sx={{ borderRadius: 2 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 2,
                flexWrap: "wrap",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Intervenciones
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Registre las intervenciones realizadas durante esta sesión.
                </Typography>
              </Box>

              {allowCreate && (
                <Button
                  variant="contained"
                  startIcon={<AddOutlinedIcon />}
                  onClick={() => setDialogOpen(true)}
                >
                  Registrar intervención
                </Button>
              )}
            </Box>

            {isError && (
              <Alert severity="error">
                No fue posible cargar las intervenciones de la sesión.
              </Alert>
            )}

            {deleteError && <Alert severity="error">{deleteError}</Alert>}

            {!isError && interventions.length === 0 && (
              <Box
                sx={{
                  py: 6,
                  textAlign: "center",
                }}
              >
                <PsychologyOutlinedIcon
                  sx={{
                    fontSize: 44,
                    color: "text.disabled",
                    mb: 1,
                  }}
                />

                <Typography variant="body1" color="text.secondary">
                  No hay intervenciones registradas para esta sesión.
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Puede registrar una intervención utilizando "Registrar
                  intervención".
                </Typography>
              </Box>
            )}

            {!isError &&
              interventions.map((intervention) => (
                <InterventionCard
                  key={intervention.id}
                  intervention={intervention}
                  onRemove={handleRemove}
                  disabled={deleteMutation.isPending}
                  allowDelete={allowCreate}
                />
              ))}
          </Stack>
        </CardContent>
      </Card>

      <SessionInterventionDialog
        open={dialogOpen}
        sessionId={session.id}
        assignedInterventionIds={interventions.map(
          (item) => item.intervencionId,
        )}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

interface InterventionCardProps {
  intervention: SessionIntervention;
  onRemove: (intervention: SessionIntervention) => void;
  disabled: boolean;
  allowDelete: boolean;
}

function InterventionCard({
  intervention,
  onRemove,
  disabled,
  allowDelete,
}: InterventionCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack spacing={1.5}>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              <PsychologyOutlinedIcon color="action" />

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1" fontWeight={700}>
                  {intervention.intervencion}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Tipo: {intervention.tipoIntervencion}
                </Typography>
              </Box>
            </Stack>

            {allowDelete && (
              <IconButton
                aria-label="Quitar intervención"
                color="error"
                onClick={() => onRemove(intervention)}
                disabled={disabled}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            )}
          </Box>

          <Divider />
        </Stack>
      </CardContent>
    </Card>
  );
}
