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
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";

import type { Sesion } from "../types/session.types";
import type { ObjetivoTerapia } from "../types/objetivoTerapia.types";

import {
  usePatientObjectives,
} from "../hooks/useSessionObjectives";

import SessionObjectiveProgressDialog from "./SessionObjectiveProgressDialog";

interface SessionObjectivesProps {
  session: Sesion;
}

function normalizeStatus(status?: string | null): string {
  return status?.trim().toUpperCase() ?? "";
}

function isActiveObjective(objective: ObjetivoTerapia): boolean {
  const status = normalizeStatus(objective.estado);

  return status === "ACTIVE" || status === "ACTIVO";
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

export default function SessionObjectives({
  session,
}: SessionObjectivesProps) {
  const [selectedObjective, setSelectedObjective] =
    useState<ObjetivoTerapia | null>(null);

  const {
    data: objectives = [],
    isLoading,
    isError,
  } = usePatientObjectives(session.pacienteId);

  const sortedObjectives = useMemo(() => {
    return [...objectives].sort((a, b) => {
      const activeComparison =
        Number(isActiveObjective(b)) - Number(isActiveObjective(a));

      if (activeComparison !== 0) {
        return activeComparison;
      }

      const dateComparison = b.fechaInicio.localeCompare(
        a.fechaInicio,
      );

      if (dateComparison !== 0) {
        return dateComparison;
      }

      return b.id - a.id;
    });
  }, [objectives]);

  const handleOpenProgress = (objective: ObjetivoTerapia) => {
    setSelectedObjective(objective);
  };

  const handleCloseProgress = () => {
    setSelectedObjective(null);
  };

  return (
    <>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            gap: 2,
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <TrackChangesOutlinedIcon color="primary" />

              <Typography variant="h5" fontWeight={700}>
                Objetivos terapéuticos
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Registre el progreso de los objetivos durante esta sesión.
            </Typography>
          </Box>
        </Box>

        {isError && (
          <Alert severity="error">
            No fue posible cargar los objetivos terapéuticos del paciente.
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

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Cargando objetivos terapéuticos...
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : sortedObjectives.length === 0 ? (
          <EmptyObjectivesState />
        ) : (
          <Stack spacing={2}>
            {sortedObjectives.map((objective) => (
              <SessionObjectiveCard
                key={objective.id}
                objective={objective}
                onRegisterProgress={handleOpenProgress}
              />
            ))}
          </Stack>
        )}
      </Stack>

      <SessionObjectiveProgressDialog
        open={Boolean(selectedObjective)}
        session={session}
        objective={selectedObjective}
        onClose={handleCloseProgress}
      />
    </>
  );
}

function EmptyObjectivesState() {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          sx={{
            minHeight: 300,
            px: 2,
          }}
        >
          <TrackChangesOutlinedIcon
            sx={{
              fontSize: 52,
              color: "text.disabled",
            }}
          />

          <Box>
            <Typography variant="h6" fontWeight={700}>
              No hay objetivos terapéuticos
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.75,
                maxWidth: 500,
              }}
            >
              El paciente no tiene objetivos terapéuticos registrados.
              Los objetivos deben gestionarse desde el plan de tratamiento.
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface SessionObjectiveCardProps {
  objective: ObjetivoTerapia;
  onRegisterProgress: (objective: ObjetivoTerapia) => void;
}

function SessionObjectiveCard({
  objective,
  onRegisterProgress,
}: SessionObjectiveCardProps) {
  const isActive = isActiveObjective(objective);

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              gap: 1.5,
            }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="flex-start"
              sx={{ minWidth: 0 }}
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
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{
                    overflowWrap: "anywhere",
                  }}
                >
                  {objective.descripcion}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Objetivo #{objective.id}
                </Typography>
              </Box>
            </Stack>

            <Chip
              label={objective.estado || "Sin estado"}
              size="small"
              color={isActive ? "success" : "default"}
              variant="outlined"
            />
          </Box>

          <Divider />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1,
              sm: 3,
            }}
          >
            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <CalendarTodayOutlinedIcon
                fontSize="small"
                color="action"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Inicio:
              </Typography>

              <Typography variant="body2" fontWeight={600}>
                {formatDate(objective.fechaInicio)}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              alignItems="center"
            >
              <CalendarTodayOutlinedIcon
                fontSize="small"
                color="action"
              />

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Meta:
              </Typography>

              <Typography variant="body2" fontWeight={600}>
                {formatDate(objective.fechaMeta)}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant={isActive ? "contained" : "outlined"}
              startIcon={
                isActive ? (
                  <AddOutlinedIcon />
                ) : (
                  <CheckCircleOutlineOutlinedIcon />
                )
              }
              onClick={() => onRegisterProgress(objective)}
              disabled={!isActive}
            >
              {isActive
                ? "Registrar avance"
                : "Objetivo no disponible"}
            </Button>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}