import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";

import type { Sesion } from "../types/session.types";
import type { SessionRiskEvaluation } from "../types/sessionRiskEvaluation.types";

import { useSessionRiskEvaluations } from "../hooks/useSessionRiskEvaluation";
import SessionRiskEvaluationDialog from "./SessionRiskEvaluationDialog";

import { useClinicalSessionContext } from "../hooks/usePatientClinicalContext";

interface SessionRiskEvaluationProps {
  session: Sesion;
  allowCreate?: boolean;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-GT", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

function formatDate(date?: string | null): string {
  if (!date) {
    return "Sin fecha";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date.substring(0, 10);
  }

  return DATE_FORMATTER.format(parsedDate);
}

export default function SessionRiskEvaluation({
  session,
  allowCreate = true,
}: SessionRiskEvaluationProps) {
  const {
    data: evaluations = [],
    isLoading,
    isError,
  } = useSessionRiskEvaluations(session.id);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] =
    useState<SessionRiskEvaluation | null>(null);

  const orderedEvaluations = useMemo(
    () =>
      [...evaluations].sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      ),
    [evaluations],
  );

  const { data: clinicalContext, isLoading: isLoadingHistory } =
    useClinicalSessionContext(session.id);

  const historicalEvaluations = useMemo(
    () =>
      (clinicalContext?.risks.items ?? [])
        .filter((evaluation) => Number(evaluation.sesionId) !== session.id)
        .map((evaluation) => ({
          id: evaluation.id,
          tipoRiesgo: evaluation.tipoRiesgo ?? "Riesgo no especificado",
          nivelRiesgo: evaluation.nivelRiesgo ?? "No especificado",
          observaciones: evaluation.observaciones,
          fecha: evaluation.fecha,
          editable: false,
        })),
    [clinicalContext, session.id],
  );

  const allEvaluations = useMemo(
    () =>
      [
        ...historicalEvaluations,
        ...orderedEvaluations.map((evaluation) => ({
          ...evaluation,
          editable: true,
        })),
      ]
        .filter(
          (evaluation, index, evaluations) =>
            evaluations.findIndex((item) => item.id === evaluation.id) ===
            index,
        )
        .sort((a, b) => {
          const dateComparison =
            new Date(b.fecha).getTime() - new Date(a.fecha).getTime();
          return dateComparison || b.id - a.id;
        }),
    [historicalEvaluations, orderedEvaluations],
  );

  const isLoadingData = isLoading || isLoadingHistory;

  const handleCreate = () => {
    setEditingEvaluation(null);
    setDialogOpen(true);
  };

  if (isLoadingData) {
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
      <Box>
        <Stack spacing={2}>
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
              <Stack direction="row" spacing={1.25} alignItems="center">
                <WarningAmberOutlinedIcon color="primary" />

                <Typography variant="h5" fontWeight={700}>
                  Riesgos identificados
                </Typography>
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.75 }}
              >
                Registre y consulte los riesgos identificados durante esta
                sesión.
              </Typography>
            </Box>

            {allowCreate && (
              <Button
                variant="contained"
                startIcon={<AddOutlinedIcon />}
                onClick={handleCreate}
              >
                Riesgo
              </Button>
            )}
          </Box>

          {isError && (
            <Alert severity="error">
              No fue posible cargar las evaluaciones de riesgo de la sesión.
            </Alert>
          )}

          {!isError && allEvaluations.length === 0 && (
            <Box
              sx={{
                py: 4,
                borderTop: 1,
                borderBottom: 1,
                borderColor: "divider",
                textAlign: "center",
              }}
            >
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
            </Box>
          )}

          {!isError && allEvaluations.length > 0 && (
            <Box>
              <Stack divider={<Divider flexItem />} spacing={0}>
                {allEvaluations.map((evaluation) => (
                  <RiskEvaluationRow
                    key={evaluation.id}
                    evaluation={evaluation}
                    onEdit={
                      evaluation.editable
                        ? () => {
                            const current = evaluations.find(
                              (item) => item.id === evaluation.id,
                            );
                            if (current) {
                              setEditingEvaluation(current);
                              setDialogOpen(true);
                            }
                          }
                        : undefined
                    }
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      <SessionRiskEvaluationDialog
        open={dialogOpen}
        sessionId={session.id}
        patientId={session.pacienteId}
        evaluation={editingEvaluation}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

interface RiskEvaluationRowProps {
  evaluation: Pick<
    SessionRiskEvaluation,
    "id" | "tipoRiesgo" | "nivelRiesgo" | "observaciones" | "fecha"
  > & { editable?: boolean };
  onEdit?: () => void;
}

function RiskEvaluationRow({ evaluation, onEdit }: RiskEvaluationRowProps) {
  return (
    <Box sx={{ py: 1.5 }}>
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

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {formatDate(evaluation.fecha)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1} alignItems="center">
            <RiskLevelIndicator level={evaluation.nivelRiesgo} />

            {evaluation.editable && onEdit && (
              <Button
                size="small"
                variant="text"
                startIcon={<EditOutlinedIcon />}
                onClick={onEdit}
              >
                Editar
              </Button>
            )}
          </Stack>
        </Box>

        {evaluation.observaciones && (
          <Typography variant="body2">{evaluation.observaciones}</Typography>
        )}
      </Stack>
    </Box>
  );
}

function RiskLevelIndicator({ level }: { level: string }) {
  const normalizedLevel = level.trim().toUpperCase();
  const isHigh =
    normalizedLevel.includes("ALTO") || normalizedLevel.includes("SEVER");
  const isModerate = normalizedLevel.includes("MODER");

  return (
    <Box
      aria-label={`Nivel de riesgo: ${level}`}
      title={`Nivel de riesgo: ${level}`}
      sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
    >
      {[0, 1, 2].map((index) => (
        <Box
          key={index}
          sx={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            bgcolor:
              isHigh ||
              (isModerate && index < 2) ||
              (!isModerate && index === 0)
                ? isHigh
                  ? "error.main"
                  : isModerate
                    ? "warning.main"
                    : "success.main"
                : "action.disabledBackground",
          }}
        />
      ))}
    </Box>
  );
}
