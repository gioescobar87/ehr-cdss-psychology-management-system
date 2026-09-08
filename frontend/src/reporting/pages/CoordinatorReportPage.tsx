import { useState } from "react";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";

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

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toInputDate(date);
}

function getMonday(value: string) {
  const date = new Date(`${value}T00:00:00`);
  const day = date.getDay();
  date.setDate(date.getDate() + (day === 0 ? -6 : 1 - day));
  return toInputDate(date);
}

export type CoordinatorReportPageData = {
  summary: NonNullable<ReturnType<typeof useCoordinatorSummary>["data"]>;
  agenda: NonNullable<ReturnType<typeof useCoordinatorAgenda>["data"]>;
  patients: NonNullable<ReturnType<typeof useCoordinatorPatients>["data"]>;
};

export default function CoordinatorReportPage() {
  const today = toInputDate(new Date());

  const [stage, setStage] = useState<CoordinatorStage>("summary");

  const [startDate, setStartDate] = useState(addDays(today, -30));
  const [endDate, setEndDate] = useState(today);

  const [selection, setSelection] = useState<CoordinatorWorkspaceSelection>({
    psychologistIds: [],
    weekStart: getMonday(today),
  });

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  const summary = useCoordinatorSummary(startDate, endDate);
  const agenda = useCoordinatorAgenda(selection.weekStart);
  const patients = useCoordinatorPatients();

  const loading = summary.isLoading || agenda.isLoading || patients.isLoading;

  const error = summary.isError || agenda.isError || patients.isError;

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
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
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

      {loading && <CircularProgress size={24} sx={{ mb: 2 }} />}

      <CoordinatorStageWorkspace
        stage={stage}
        data={data}
        selection={selection}
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
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
        onCloseAppointment={() => setSelectedAppointment(null)}
        onClosePatient={() => setSelectedPatient(null)}
      />
    </Box>
  );
}
