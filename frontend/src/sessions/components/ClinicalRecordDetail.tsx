import {
  Alert,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type {
  ClinicalActivity,
} from "../types/clinicalRecord.types";

import {
  useHistoricalPsychologicalTest,
  useHistoricalRiskEvaluation,
  useHistoricalSession,
} from "../hooks/useClinicalRecordDetails";

import { formatRecordDate } from "../../shared/utils/dateUtils";

interface ClinicalRecordDetailProps {
  activity: ClinicalActivity | null;
}

export default function ClinicalRecordDetail({
  activity,
}: ClinicalRecordDetailProps) {
  if (!activity) {
    return (
      <Box
        sx={{
          minHeight: 420,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 3,
        }}
      >
        <Typography
          color="text.secondary"
          textAlign="center"
        >
          Seleccione una actividad del historial clínico.
        </Typography>
      </Box>
    );
  }

  switch (activity.type) {
    case "observation":
      return (
        <ObservationDetail
          sessionId={activity.sessionId}
        />
      );

    case "risk":
      return (
        <RiskDetail
          evaluationId={activity.riskId}
        />
      );

    case "psychological-test":
      return (
        <PsychologicalTestDetail
          applicationId={activity.testId}
        />
      );

    case "diagnosis":
      return (
        <UnsupportedDetail
          title="Diagnóstico"
          message="El detalle histórico del diagnóstico se integrará en la siguiente iteración."
        />
      );

    case "objective":
      return (
        <UnsupportedDetail
          title="Objetivo terapéutico"
          message="El detalle histórico del objetivo terapéutico se integrará en la siguiente iteración."
        />
      );
  }
}

function ObservationDetail({
  sessionId,
}: {
  sessionId: number;
}) {
  const {
    data: session,
    isLoading,
    isError,
  } = useHistoricalSession(sessionId);

  if (isLoading) {
    return <DetailLoading />;
  }

  if (isError || !session) {
    return <DetailError />;
  }

  return (
    <Stack spacing={3}>
      <DetailHeader
        title="Observaciones generales"
        date={session.fechaSesion}
      />

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
          fontWeight={700}
          textTransform="uppercase"
        >
          Observaciones generales
        </Typography>

        <ClinicalText
          value={session.observacionesGenerales}
        />
      </Box>
    </Stack>
  );
}

function RiskDetail({
  evaluationId,
}: {
  evaluationId: number;
}) {
  const {
    data: evaluation,
    isLoading,
    isError,
  } = useHistoricalRiskEvaluation(evaluationId);

  if (isLoading) {
    return <DetailLoading />;
  }

  if (isError || !evaluation) {
    return <DetailError />;
  }

  return (
    <Stack spacing={3}>
      <DetailHeader
        title="Evaluación de riesgo"
        date={evaluation.fecha}
      />

      <Stack spacing={2}>
        <DetailField
          label="Tipo de riesgo"
          value={
            evaluation.tipoRiesgo ??
            "No especificado"
          }
        />

        <DetailField
          label="Nivel de riesgo"
          value={
            evaluation.nivelRiesgo ??
            "No especificado"
          }
        />

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            textTransform="uppercase"
          >
            Observaciones
          </Typography>

          <ClinicalText
            value={evaluation.observaciones}
          />
        </Box>
      </Stack>
    </Stack>
  );
}

function PsychologicalTestDetail({
  applicationId,
}: {
  applicationId: number;
}) {
  const {
    data: application,
    isLoading,
    isError,
  } = useHistoricalPsychologicalTest(
    applicationId,
  );

  if (isLoading) {
    return <DetailLoading />;
  }

  if (isError || !application) {
    return <DetailError />;
  }

  return (
    <Stack spacing={3}>
      <DetailHeader
        title="Aplicación de prueba psicológica"
        date={application.fechaAplicacion}
      />

      <Stack spacing={2}>
        <DetailField
          label="Prueba"
          value={`#${application.pruebaPsicologicaId}`}
        />

        <DetailField
          label="Estado"
          value={
            application.estado ??
            "No especificado"
          }
        />

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
            fontWeight={700}
            textTransform="uppercase"
          >
            Interpretación
          </Typography>

          <ClinicalText
            value={application.interpretacion}
          />
        </Box>

        {application.archivoAdjunto && (
          <DetailField
            label="Archivo adjunto"
            value={application.archivoAdjunto}
          />
        )}
      </Stack>
    </Stack>
  );
}

function DetailHeader({
  title,
  date,
}: {
  title: string;
  date: string;
}) {
  return (
    <Box>
      <Typography
        variant="h5"
        fontWeight={700}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5 }}
      >
        {formatRecordDate(date)}
      </Typography>

      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}

function DetailField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        fontWeight={700}
        textTransform="uppercase"
      >
        {label}
      </Typography>

      <Typography
        variant="body1"
        sx={{ mt: 0.5 }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function ClinicalText({
  value,
}: {
  value: string | null | undefined;
}) {
  return (
    <Typography
      variant="body1"
      sx={{
        mt: 0.75,
        whiteSpace: "pre-wrap",
        lineHeight: 1.7,
      }}
    >
      {value?.trim() ||
        "Sin información registrada."}
    </Typography>
  );
}

function DetailLoading() {
  return (
    <Box
      sx={{
        minHeight: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <CircularProgress size={28} />
    </Box>
  );
}

function DetailError() {
  return (
    <Alert severity="error">
      No fue posible cargar el detalle del registro
      clínico.
    </Alert>
  );
}

function UnsupportedDetail({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <Stack spacing={2}>
      <Typography
        variant="h5"
        fontWeight={700}
      >
        {title}
      </Typography>

      <Alert severity="info">
        {message}
      </Alert>
    </Stack>
  );
}