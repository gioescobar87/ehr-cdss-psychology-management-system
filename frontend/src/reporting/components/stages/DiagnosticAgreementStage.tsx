import {
  Alert,
  Box,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

import type { CoordinatorDiagnosticAgreement } from "../../types/coordinatorReport.types";


function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "America/Guatemala",
  }).format(date);
}

function getPatientInitials(name: string | null | undefined) {
  if (!name?.trim()) {
    return "—";
  }

  return name
    .trim()
    .split(/\s+/)
    .map((part) => `${Array.from(part)[0].toLocaleUpperCase("es-GT")}.`)
    .join(". ");
}


function getOutcome(value: CoordinatorDiagnosticAgreement["concordanciaDiagnostica"]) {
  if (value === 1) {
    return { label: "Concordante", color: "success" as const };
  }

  if (value === 0) {
    return { label: "No concordante", color: "warning" as const };
  }

  return { label: "Sin cálculo", color: "default" as const };
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <Typography variant="h5" fontWeight={700}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Box>
  );
}

export default function DiagnosticAgreementStage({
  evaluations,
}: {
  evaluations: CoordinatorDiagnosticAgreement[];
}) {
  const concordant = evaluations.filter(
    (evaluation) => evaluation.concordanciaDiagnostica === 1,
  ).length;
  const discordant = evaluations.filter(
    (evaluation) => evaluation.concordanciaDiagnostica === 0,
  ).length;
  const pending = evaluations.length - concordant - discordant;
  const decided = concordant + discordant;
  const agreementRate = decided === 0 ? null : (concordant / decided) * 100;

  if (evaluations.length === 0) {
    return (
      <Alert severity="info">
        No hay evaluaciones diagnósticas registradas para el período seleccionado.
      </Alert>
    );
  }

  return (
    <Stack spacing={2.5}>
      <Alert severity="info">
        Concordancia significa que el diagnóstico seleccionado por el profesional
        coincide con el diagnóstico sugerido por el sistema. La tasa excluye
        evaluaciones sin resultado registrado.
      </Alert>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1.5, sm: 4 }}
        sx={{ py: 0.5 }}
      >
        <Metric label="Concordantes" value={concordant} />
        <Metric label="No concordantes" value={discordant} />
        <Metric label="Sin cálculo" value={pending} />
        <Metric
          label="Concordancia sobre evaluadas"
          value={agreementRate === null ? "—" : `${agreementRate.toFixed(1)}%`}
        />
      </Stack>

      <TableContainer
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 1,
          overflowX: "auto",
        }}
      >
        <Table size="small" sx={{ minWidth: 760 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "action.hover" }}>
              <TableCell>Fecha de evaluación</TableCell>
              <TableCell>Paciente</TableCell>
              <TableCell>Psicólogo</TableCell>
              <TableCell>Diagnóstico sugerido</TableCell>
              <TableCell>Diagnóstico seleccionado</TableCell>
              <TableCell>Resultado</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {evaluations.map((evaluation) => {
              const outcome = getOutcome(evaluation.concordanciaDiagnostica);

              return (
                <TableRow key={evaluation.id} hover>
                  <TableCell>{formatDate(evaluation.fechaHoraInferencia)}</TableCell>
                  <TableCell>{getPatientInitials(evaluation.patientName)}</TableCell>
                  <TableCell>{evaluation.psychologistName}</TableCell>
                  <TableCell>
                    {evaluation.suggestedDiagnosis || "—"}
                  </TableCell>
                  <TableCell>
                    {evaluation.selectedDiagnosis || "—"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<FactCheckOutlinedIcon />}
                      label={outcome.label}
                      color={outcome.color}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}