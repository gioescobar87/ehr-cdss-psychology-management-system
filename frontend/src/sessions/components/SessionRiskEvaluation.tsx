import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import type { Sesion } from "../types/session.types";
import type { SessionRiskEvaluation } from "../types/sessionRiskEvaluation.types";

import { useSessionRiskEvaluations } from "../hooks/useSessionRiskEvaluation";
import { useDeleteRiskEvaluation } from "../hooks/useSessionRiskEvaluationMutations";

import SessionRiskEvaluationDialog from "./SessionRiskEvaluationDialog";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionRiskEvaluationProps {
  session: Sesion;
}

const DATE_TIME_FORMATTER = new Intl.DateTimeFormat("es-GT", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export default function SessionRiskEvaluation({
  session,
}: SessionRiskEvaluationProps) {
  const {
    data: evaluations = [],
    isLoading,
    isError,
  } = useSessionRiskEvaluations(session.id);

  const deleteMutation = useDeleteRiskEvaluation();

  const { showSuccess } = useNotification();

  const [dialogOpen, setDialogOpen] = useState(false);

  const orderedEvaluations = useMemo(
    () =>
      [...evaluations].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      ),
    [evaluations],
  );

  const latestEvaluation = orderedEvaluations[0];

  const handleDelete = (evaluation: SessionRiskEvaluation) => {
    if (deleteMutation.isPending) {
      return;
    }

    const confirmed = window.confirm(
      "¿Está seguro de que desea eliminar esta evaluación de riesgo?",
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(
      {
        id: evaluation.id,
        sessionId: session.id,
        patientId: session.pacienteId,
      },
      {
        onSuccess: () => {
          showSuccess("La evaluación de riesgo fue eliminada correctamente.");
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
                  Evaluación de riesgo
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Registre y consulte las evaluaciones de riesgo realizadas
                  durante esta sesión.
                </Typography>
              </Box>

              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={() => setDialogOpen(true)}
              >
                Riesgo
              </Button>
            </Box>

            {isError && (
              <Alert severity="error">
                No fue posible cargar las evaluaciones de riesgo de la sesión.
              </Alert>
            )}

            {deleteError && <Alert severity="error">{deleteError}</Alert>}

            {!isError && latestEvaluation && (
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                }}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <WarningAmberOutlinedIcon color="action" />

                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          Estado de riesgo registrado
                        </Typography>

                        <Typography variant="h6" fontWeight={700}>
                          {latestEvaluation.nivelRiesgo}
                        </Typography>
                      </Box>
                    </Stack>

                    <Typography variant="body2">
                      Tipo: <strong>{latestEvaluation.tipoRiesgo}</strong>
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Última evaluación:{" "}
                      {DATE_TIME_FORMATTER.format(
                        new Date(latestEvaluation.fecha),
                      )}
                    </Typography>

                    {latestEvaluation.observaciones && (
                      <>
                        <Divider />

                        <Typography variant="body2">
                          {latestEvaluation.observaciones}
                        </Typography>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            )}

            {!isError && evaluations.length === 0 && (
              <Card
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  borderStyle: "dashed",
                }}
              >
                <CardContent>
                  <Stack
                    spacing={1}
                    alignItems="center"
                    textAlign="center"
                    sx={{ py: 4 }}
                  >
                    <WarningAmberOutlinedIcon
                      sx={{
                        fontSize: 44,
                        color: "text.disabled",
                      }}
                    />

                    <Typography variant="body1" fontWeight={600}>
                      Sin evaluación registrada
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ maxWidth: 460 }}
                    >
                      No existen evaluaciones de riesgo registradas para esta
                      sesión.
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            )}

            {!isError && orderedEvaluations.length > 0 && (
              <Box>
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ mb: 1.5 }}
                >
                  Riesgos identificados durante esta sesión
                </Typography>

                <Stack spacing={1.5}>
                  {orderedEvaluations.map((evaluation) => (
                    <RiskEvaluationRow
                      key={evaluation.id}
                      evaluation={evaluation}
                      onDelete={handleDelete}
                      disabled={deleteMutation.isPending}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <SessionRiskEvaluationDialog
        open={dialogOpen}
        sessionId={session.id}
        patientId={session.pacienteId}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

interface RiskEvaluationRowProps {
  evaluation: SessionRiskEvaluation;
  onDelete: (evaluation: SessionRiskEvaluation) => void;
  disabled: boolean;
}

function RiskEvaluationRow({
  evaluation,
  onDelete,
  disabled,
}: RiskEvaluationRowProps) {
  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={1.25}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {evaluation.tipoRiesgo}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                {DATE_TIME_FORMATTER.format(new Date(evaluation.fecha))}
              </Typography>
            </Box>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={evaluation.nivelRiesgo}
                size="small"
                variant="outlined"
              />

              <IconButton
                aria-label="Eliminar evaluación de riesgo"
                color="error"
                onClick={() => onDelete(evaluation)}
                disabled={disabled}
              >
                <DeleteOutlineOutlinedIcon />
              </IconButton>
            </Stack>
          </Box>

          {evaluation.observaciones && (
            <>
              <Divider />

              <Typography variant="body2">
                {evaluation.observaciones}
              </Typography>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
