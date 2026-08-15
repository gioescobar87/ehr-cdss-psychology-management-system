import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import PsychologyIcon from "@mui/icons-material/Psychology";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";

import type { Sesion } from "../types/session.types";

import {
  usePatientDiagnoses,
  usePatientObjectives,
  usePatientRiskEvaluations,
  usePatientSessions,
} from "../hooks/usePatientClinicalContext";

interface SessionSummaryProps {
  session: Sesion;
}

const DATE_FORMATTER = new Intl.DateTimeFormat("es-GT", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const FULL_DATE_FORMATTER = new Intl.DateTimeFormat("es-GT", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function SessionSummary({ session }: SessionSummaryProps) {
  const {
    data: previousSessions = [],
    isLoading: loadingSessions,
    isError: sessionsError,
  } = usePatientSessions(session.pacienteId);

  const {
    data: diagnoses = [],
    isLoading: loadingDiagnoses,
    isError: diagnosesError,
  } = usePatientDiagnoses(session.pacienteId);

  const {
    data: objectives = [],
    isLoading: loadingObjectives,
    isError: objectivesError,
  } = usePatientObjectives(session.pacienteId);

  const {
    data: riskEvaluations = [],
    isLoading: loadingRiskEvaluations,
    isError: riskEvaluationsError,
  } = usePatientRiskEvaluations(session.pacienteId);

  const orderedSessions = [...previousSessions]
    .filter((item) => item.id !== session.id)
    .sort(
      (a, b) =>
        new Date(b.fechaSesion).getTime() - new Date(a.fechaSesion).getTime(),
    );

  const activeDiagnoses = diagnoses.filter(
    (diagnosis) => diagnosis.estado?.toLowerCase() === "activo",
  );

  const activeObjectives = objectives.filter(
    (objective) => objective.estado?.toLowerCase() === "activo",
  );

  const orderedRiskEvaluations = [...riskEvaluations].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
  );

  const latestRisk = orderedRiskEvaluations[0];

  const hasLoading =
    loadingSessions ||
    loadingDiagnoses ||
    loadingObjectives ||
    loadingRiskEvaluations;

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h5" fontWeight={700}>
          Resumen de la sesión
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Contexto clínico relevante antes de continuar con la documentación.
        </Typography>
      </Box>

      {hasLoading && (
        <Alert severity="info">
          Cargando información clínica del paciente...
        </Alert>
      )}

      {(sessionsError ||
        diagnosesError ||
        objectivesError ||
        riskEvaluationsError) && (
        <Alert severity="warning">
          No fue posible cargar toda la información clínica del paciente.
          Algunas secciones pueden estar incompletas.
        </Alert>
      )}

      {/* Patient */}

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PsychologyIcon color="primary" />

            <Box>
              <Typography variant="body2" color="text.secondary">
                Paciente
              </Typography>

              <Typography variant="h6" fontWeight={700}>
                {session.pacienteNombre}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Previous sessions */}

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <EventIcon color="primary" />

            <Typography variant="h6" fontWeight={700}>
              Sesiones anteriores
            </Typography>
          </Stack>

          {orderedSessions.length === 0 ? (
            <Typography color="text.secondary">
              No existen sesiones anteriores registradas.
            </Typography>
          ) : (
            <List disablePadding>
              {orderedSessions.slice(0, 5).map((previousSession, index) => (
                <Box key={previousSession.id}>
                  <ListItem disableGutters>
                    <ListItemText
                      primary={previousSession.tipoSesion ?? "Sesión clínica"}
                      secondary={DATE_FORMATTER.format(
                        new Date(previousSession.fechaSesion),
                      )}
                    />
                  </ListItem>

                  {index < Math.min(orderedSessions.length, 5) - 1 && (
                    <Divider />
                  )}
                </Box>
              ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Diagnoses */}

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <PsychologyIcon color="primary" />

            <Typography variant="h6" fontWeight={700}>
              Diagnósticos actuales
            </Typography>
          </Stack>

          {activeDiagnoses.length === 0 ? (
            <Typography color="text.secondary">
              No existen diagnósticos activos registrados.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {activeDiagnoses.map((diagnosis) => (
                <Box
                  key={diagnosis.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {diagnosis.diagnostico}
                    </Typography>

                    {diagnosis.codigoDsm && (
                      <Typography variant="body2" color="text.secondary">
                        DSM: {diagnosis.codigoDsm}
                      </Typography>
                    )}
                  </Box>

                  <Chip
                    label={diagnosis.estado}
                    size="small"
                    variant="outlined"
                  />
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Objectives */}

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <TrackChangesIcon color="primary" />

            <Typography variant="h6" fontWeight={700}>
              Objetivos activos
            </Typography>
          </Stack>

          {activeObjectives.length === 0 ? (
            <Typography color="text.secondary">
              No existen objetivos terapéuticos activos.
            </Typography>
          ) : (
            <Stack spacing={1.5}>
              {activeObjectives.map((objective) => (
                <Box key={objective.id}>
                  <Typography fontWeight={600}>
                    {objective.descripcion}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 0.5 }}
                  >
                    Meta: {DATE_FORMATTER.format(new Date(objective.fechaMeta))}
                  </Typography>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Risk */}

      <Card variant="outlined">
        <CardContent>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
            <WarningAmberIcon color="warning" />

            <Typography variant="h6" fontWeight={700}>
              Alertas clínicas
            </Typography>
          </Stack>

          {!latestRisk ? (
            <Typography color="text.secondary">
              No existen evaluaciones de riesgo registradas.
            </Typography>
          ) : (
            <Alert
              severity={
                latestRisk.nivelRiesgo?.toLowerCase().includes("alto")
                  ? "error"
                  : "warning"
              }
            >
              <Typography fontWeight={700}>
                {latestRisk.tipoRiesgo}: {latestRisk.nivelRiesgo}
              </Typography>

              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Evaluación del{" "}
                {FULL_DATE_FORMATTER.format(new Date(latestRisk.fecha))}
              </Typography>

              {latestRisk.observaciones && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {latestRisk.observaciones}
                </Typography>
              )}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}
