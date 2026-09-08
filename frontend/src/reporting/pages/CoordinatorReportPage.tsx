import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import type { Appointment } from "../../appointments/types/appointment.types";
import {
  useCoordinatorAgenda,
  useCoordinatorPatients,
  useCoordinatorSummary,
} from "../hooks/useCoordinatorReport";
import CoordinatorStageWorkspace from "../components/CoordinatorStageWorkspace";
import type {
  CoordinatorStage,
  CoordinatorWorkspaceSelection,
} from "../types/coordinatorWorkspace.types";

function toInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getCurrentMonth() {
  return toInputDate(new Date()).slice(0, 7);
}

function getMonthStart(month: string) {
  return month ? `${month}-01` : "";
}

function getMonthEnd(month: string) {
  if (!month) {
    return "";
  }

  const [year, monthNumber] = month.split("-").map(Number);
  const date = new Date(year, monthNumber, 0);

  return toInputDate(date);
}

function getMonday(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDay();

  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));

  return toInputDate(date);
}

export type CoordinatorReportPageData = {
  summary: NonNullable<
    ReturnType<typeof useCoordinatorSummary>["data"]
  >;
  agenda: NonNullable<
    ReturnType<typeof useCoordinatorAgenda>["data"]
  >;
  patients: NonNullable<
    ReturnType<typeof useCoordinatorPatients>["data"]
  >;
};

export default function CoordinatorReportPage() {
  const today = toInputDate(new Date());
  const currentMonth = getCurrentMonth();

  const [stage, setStage] =
    useState<CoordinatorStage>("summary");

  const [reportMonth, setReportMonth] =
    useState(currentMonth);

  const [selection, setSelection] =
    useState<CoordinatorWorkspaceSelection>({
      psychologistIds: [],
      weekStart: getMonday(today),
    });

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [selectedPatient, setSelectedPatient] =
    useState<number | null>(null);

  const startDate = getMonthStart(reportMonth);
  const endDate = getMonthEnd(reportMonth);

  const summary = useCoordinatorSummary(
    startDate,
    endDate,
    stage === "summary" && Boolean(reportMonth),
  );

  const agenda = useCoordinatorAgenda(
    selection.weekStart,
    stage === "agenda",
  );

  const patients = useCoordinatorPatients(
    stage === "patients",
  );

  const loading =
    stage === "summary"
      ? summary.isLoading
      : stage === "agenda"
        ? agenda.isLoading
        : patients.isLoading;

  const error =
    stage === "summary"
      ? summary.isError
      : stage === "agenda"
        ? agenda.isError
        : patients.isError;

  const data: CoordinatorReportPageData = {
    summary: summary.data ?? [],
    agenda: agenda.data ?? [],
    patients: patients.data ?? [],
  };

  return (
    <Box
      sx={{
        maxWidth: 1440,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: 3,
      }}
    >
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800 }}
        >
          Reporte de coordinación
        </Typography>

        <Typography color="text.secondary">
          Seguimiento de carga, agenda y ciclo de servicio del equipo asignado.
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          No fue posible cargar el reporte.
        </Alert>
      )}

      {loading && (
        <CircularProgress
          size={24}
          sx={{ mb: 2 }}
        />
      )}

      <CoordinatorStageWorkspace
        stage={stage}
        data={data}
        selection={selection}
        reportMonth={reportMonth}
        onReportMonthChange={setReportMonth}
        callbacks={{
          onWeekStartChange: (weekStart) =>
            setSelection((current) => ({
              ...current,
              weekStart,
            })),

          onPsychologistChange: (psychologistIds) =>
            setSelection((current) => ({
              ...current,
              psychologistIds,
            })),

          onAppointmentSelect: setSelectedAppointment,
          onPatientSelect: setSelectedPatient,
        }}
        onStageChange={setStage}
        selectedAppointment={selectedAppointment}
        selectedPatient={selectedPatient}
        onCloseAppointment={() =>
          setSelectedAppointment(null)
        }
        onClosePatient={() =>
          setSelectedPatient(null)
        }
      />
    </Box>
  );
}
