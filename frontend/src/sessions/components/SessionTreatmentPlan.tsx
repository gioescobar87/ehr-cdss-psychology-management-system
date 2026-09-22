import { useMemo } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

import type { Sesion } from "../types/session.types";
import type { PlanTratamiento } from "../types/planTratamiento.types";
import type { ObjetivoTerapia } from "../types/objetivoTerapia.types";

import { usePatientTreatmentPlans } from "../hooks/usePlanTratamiento";
import { usePatientObjectives } from "../hooks/useSessionObjectives";

interface SessionTreatmentPlanProps {
  session: Sesion;
}

function normalizeStatus(status?: string | null): string {
  return status?.trim().toUpperCase() ?? "";
}

function isActiveStatus(status?: string | null): boolean {
  const normalized = normalizeStatus(status);

  return normalized === "ACTIVE" || normalized === "ACTIVO";
}

function formatDate(date?: string | null): string {
  if (!date) {
    return "Sin fecha";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function SessionTreatmentPlan({
  session,
}: SessionTreatmentPlanProps) {
  const {
    data: plans = [],
    isLoading: plansLoading,
    isError: plansError,
  } = usePatientTreatmentPlans(session.pacienteId);

  const {
    data: objectives = [],
    isLoading: objectivesLoading,
    isError: objectivesError,
  } = usePatientObjectives(session.pacienteId);

  const isLoading = plansLoading || objectivesLoading;
  const isError = plansError || objectivesError;

  const sortedPlans = useMemo(() => {
    return [...plans].sort((a, b) => {
      const activeComparison =
        Number(isActiveStatus(b.estado)) - Number(isActiveStatus(a.estado));

      if (activeComparison !== 0) {
        return activeComparison;
      }

      return b.fechaInicio.localeCompare(a.fechaInicio);
    });
  }, [plans]);

  const objectivesByPlan = useMemo(() => {
    const map = new Map<number, ObjetivoTerapia[]>();

    for (const objective of objectives) {
      const list = map.get(objective.planTratamientoId) ?? [];
      list.push(objective);
      map.set(objective.planTratamientoId, list);
    }

    return map;
  }, [objectives]);

  return (
    <Stack spacing={3}>
      <Box>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <AssignmentOutlinedIcon color="primary" />
          <Typography variant="h5" fontWeight={700}>
            Plan terapéutico
          </Typography>
        </Stack>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
          Consulte el plan de tratamiento del paciente y sus objetivos
          terapéuticos asociados.
        </Typography>
      </Box>

      {isError && (
        <Alert severity="error">
          No fue posible cargar el plan terapéutico del paciente.
        </Alert>
      )}

      {isLoading ? (
        <Card variant="outlined">
          <CardContent>
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              sx={{ minHeight: 260 }}
            >
              <CircularProgress size={32} />
              <Typography variant="body2" color="text.secondary">
                Cargando plan terapéutico...
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : sortedPlans.length === 0 ? (
        <Card variant="outlined" sx={{ borderRadius: 2 }}>
          <CardContent>
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="center"
              textAlign="center"
              sx={{ minHeight: 260, px: 2 }}
            >
              <AssignmentOutlinedIcon
                sx={{ fontSize: 40, color: "text.disabled" }}
              />
              <Typography variant="body1" fontWeight={600}>
                Sin plan de tratamiento registrado
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Este paciente aún no cuenta con un plan de tratamiento asociado.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Stack spacing={2}>
          {sortedPlans.map((plan) => (
            <TreatmentPlanCard
              key={plan.id}
              plan={plan}
              objectives={objectivesByPlan.get(plan.id) ?? []}
            />
          ))}
        </Stack>
      )}
    </Stack>
  );
}

function TreatmentPlanCard({
  plan,
  objectives,
}: {
  plan: PlanTratamiento;
  objectives: ObjetivoTerapia[];
}) {
  const active = isActiveStatus(plan.estado);

  return (
    <Card variant="outlined" sx={{ borderRadius: 2 }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={1.5}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight={700}>
                {plan.diagnostico}
                {plan.codigoIcd ? ` (${plan.codigoIcd})` : ""}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatDate(plan.fechaInicio)} -{" "}
                {plan.fechaFin ? formatDate(plan.fechaFin) : "En curso"}
              </Typography>
            </Box>
            <Chip
              label={plan.estado}
              color={active ? "success" : "default"}
              size="small"
            />
          </Stack>

          {plan.descripcionGeneral && (
            <Typography variant="body2">{plan.descripcionGeneral}</Typography>
          )}

          <Divider />

          <Stack spacing={1.25}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TrackChangesOutlinedIcon fontSize="small" color="action" />
              <Typography variant="subtitle2" fontWeight={700}>
                Objetivos terapéuticos
              </Typography>
            </Stack>

            {objectives.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Este plan no tiene objetivos terapéuticos registrados.
              </Typography>
            ) : (
              <Stack spacing={1}>
                {objectives.map((objective) => (
                  <Box
                    key={objective.id}
                    sx={{
                      p: 1.5,
                      borderRadius: 1.5,
                      border: 1,
                      borderColor: "divider",
                    }}
                  >
                    <Stack
                      direction={{ xs: "column", sm: "row" }}
                      justifyContent="space-between"
                      alignItems={{ xs: "flex-start", sm: "center" }}
                      gap={1}
                    >
                      <Typography variant="body2">
                        {objective.descripcion}
                      </Typography>
                      <Chip
                        label={objective.estado}
                        color={
                          isActiveStatus(objective.estado)
                            ? "success"
                            : "default"
                        }
                        size="small"
                      />
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      Inicio: {formatDate(objective.fechaInicio)} · Meta:{" "}
                      {formatDate(objective.fechaMeta)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
