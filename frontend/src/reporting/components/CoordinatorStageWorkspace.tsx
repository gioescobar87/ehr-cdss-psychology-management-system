import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import AppointmentDetailsDrawer from "../../appointments/components/AppointmentDetailsDrawer";
import type { Appointment } from "../../appointments/types/appointment.types";
import PatientDetailsDialog from "../../patients/components/PatientDetailsDialog";
import { COORDINATOR_STAGE_LABELS } from "../constants/coordinatorStage.constants";
import AgendaStage from "./stages/AgendaStage";
import PatientsStage from "./stages/PatientsStage";
import SummaryStage from "./stages/SummaryStage";
import CoordinatorReportStepper from "./CoordinatorReportStepper";
import type {
  CoordinatorReportPageData,
  CoordinatorStage,
  CoordinatorWorkspaceCallbacks,
  CoordinatorWorkspaceSelection,
} from "../types/coordinatorWorkspace.types";

const palette = [
  "#0f766e",
  "#2563eb",
  "#b45309",
  "#be123c",
  "#7c3aed",
  "#15803d",
  "#0891b2",
  "#dc2626",
  "#9333ea",
  "#ca8a04",
  "#0369a1",
  "#c026d3",
  "#ea580c",
  "#4f46e5",
  "#65a30d",
  "#9f1239",
  "#0e7490",
  "#a16207",
  "#6b21a8",
  "#166534",
];

interface CoordinatorStageWorkspaceProps {
  stage: CoordinatorStage;
  data: CoordinatorReportPageData;
  selection: CoordinatorWorkspaceSelection;
  startDate: string;
  endDate: string;
  onStartDateChange: (startDate: string) => void;
  onEndDateChange: (endDate: string) => void;
  callbacks: CoordinatorWorkspaceCallbacks;
  onStageChange: (stage: CoordinatorStage) => void;
  selectedAppointment: Appointment | null;
  selectedPatient: number | null;
  onCloseAppointment: () => void;
  onClosePatient: () => void;
}

function addDays(value: string, days: number) {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function formatWeekStart(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

export default function CoordinatorStageWorkspace({
  stage,
  data,
  selection,
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  callbacks,
  onStageChange,
  selectedAppointment,
  selectedPatient,
  onCloseAppointment,
  onClosePatient,
}: CoordinatorStageWorkspaceProps) {
  const psychologistOptions = data.summary.map(
    ({ psychologistId, psychologistName }) => ({
      psychologistId,
      psychologistName,
    }),
  );

  const selectedPsychologistIds = selection.psychologistIds;

  const allPsychologistsSelected =
    psychologistOptions.length > 0 &&
    selectedPsychologistIds.length === psychologistOptions.length;

  const filteredSummary =
    selectedPsychologistIds.length === 0
      ? data.summary
      : data.summary.filter((row) =>
          selectedPsychologistIds.includes(row.psychologistId),
        );

  const filteredAgenda =
    selectedPsychologistIds.length === 0
      ? data.agenda
      : data.agenda.filter((item) =>
          selectedPsychologistIds.includes(item.usuarioId),
        );

  const filteredPatients =
    selectedPsychologistIds.length === 0
      ? data.patients
      : data.patients.filter((patient) =>
          selectedPsychologistIds.includes(patient.psychologistId),
        );

  const psychologistColors = new Map(
    psychologistOptions.map(({ psychologistId }, index) => [
      psychologistId,
      palette[index % palette.length],
    ]),
  );

  const selectedPsychologistNames = psychologistOptions
    .filter(({ psychologistId }) =>
      selectedPsychologistIds.includes(psychologistId),
    )
    .map(({ psychologistName }) => psychologistName);

  const handleWeekChange = (days: number) => {
    callbacks.onWeekStartChange(addDays(selection.weekStart, days));
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: "flex-start",
        gap: { xs: 2, md: 3 },
        width: "100%",
      }}
    >
      <Box sx={{ pt: 1 }}>
        <CoordinatorReportStepper
          activeStage={stage}
          onStageChange={onStageChange}
        />
      </Box>

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", lg: "center" }}
            sx={{ mb: 3 }}
          >
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ minWidth: 0 }}
            >
              {stage === "summary" && (
                <AssessmentOutlinedIcon color="primary" />
              )}

              {stage === "agenda" && <EventNoteOutlinedIcon color="primary" />}

              {stage === "patients" && (
                <PeopleAltOutlinedIcon color="primary" />
              )}

              <Box sx={{ minWidth: 0 }}>
                <Typography variant="h6">
                  {COORDINATOR_STAGE_LABELS[stage]}
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Información operativa del equipo asignado.
                </Typography>
              </Box>
            </Stack>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems={{ xs: "stretch", sm: "center" }}
              justifyContent={{ xs: "flex-start", lg: "flex-end" }}
              sx={{
                flexShrink: 0,
              }}
            >
              {stage === "agenda" ? (
                <Stack
                  direction="row"
                  spacing={0.5}
                  alignItems="center"
                  justifyContent={{ xs: "center", sm: "flex-end" }}
                >
                  <Button
                    aria-label="Semana anterior"
                    onClick={() => handleWeekChange(-7)}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                    }}
                  >
                    <ChevronLeftIcon />
                  </Button>

                  <Typography
                    variant="body2"
                    sx={{
                      minWidth: { xs: 220, sm: 250 },
                      textAlign: "center",
                      textTransform: "capitalize",
                      fontWeight: 600,
                    }}
                  >
                    {formatWeekStart(selection.weekStart)}
                  </Typography>

                  <Button
                    aria-label="Semana siguiente"
                    onClick={() => handleWeekChange(7)}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                    }}
                  >
                    <ChevronRightIcon />
                  </Button>
                </Stack>
              ) : (
                <>
                  <TextField
                    label="Fecha desde"
                    type="date"
                    size="small"
                    value={startDate}
                    onChange={(event) => onStartDateChange(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />

                  <TextField
                    label="Fecha hasta"
                    type="date"
                    size="small"
                    value={endDate}
                    onChange={(event) => onEndDateChange(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}

              <FormControl
                size="small"
                sx={{
                  minWidth: 240,
                  maxWidth: { sm: 360 },
                }}
              >
                <InputLabel id="coordinator-psychologist-label">
                  Psicólogos
                </InputLabel>

                <Select
                  labelId="coordinator-psychologist-label"
                  multiple
                  value={selectedPsychologistIds}
                  label="Psicólogos"
                  onChange={(event) => {
                    const value = event.target.value;

                    const nextIds =
                      typeof value === "string"
                        ? value.split(",").filter(Boolean).map(Number)
                        : value.map(Number);

                    const allSelected =
                      psychologistOptions.length > 0 &&
                      nextIds.length === psychologistOptions.length;

                    callbacks.onPsychologistChange(allSelected ? [] : nextIds);
                  }}
                  renderValue={(selected) => {
                    if (selected.length === 0 || allPsychologistsSelected) {
                      return "Todos";
                    }

                    return selectedPsychologistNames.join(", ");
                  }}
                >
                  <MenuItem
                    value="all"
                    onClick={(event) => {
                      event.preventDefault();
                      callbacks.onPsychologistChange([]);
                    }}
                  >
                    <Checkbox
                      checked={
                        selectedPsychologistIds.length === 0 ||
                        allPsychologistsSelected
                      }
                      size="small"
                    />

                    <ListItemText primary="Seleccionar todos" />
                  </MenuItem>

                  {psychologistOptions.map(
                    ({ psychologistId, psychologistName }) => {
                      const checked =
                        selectedPsychologistIds.includes(psychologistId);

                      return (
                        <MenuItem key={psychologistId} value={psychologistId}>
                          <Checkbox checked={checked} size="small" />

                          <ListItemText primary={psychologistName} />
                        </MenuItem>
                      );
                    },
                  )}
                </Select>
              </FormControl>
            </Stack>
          </Stack>

          <CoordinatorStageContent
            stage={stage}
            summary={filteredSummary}
            agenda={filteredAgenda}
            patients={filteredPatients}
            weekStart={selection.weekStart}
            psychologistColors={psychologistColors}
            onAppointmentSelect={callbacks.onAppointmentSelect}
            onPatientSelect={callbacks.onPatientSelect}
          />
        </Paper>

        <AppointmentDetailsDrawer
          open={selectedAppointment !== null}
          appointment={selectedAppointment}
          onClose={onCloseAppointment}
        />

        <PatientDetailsDialog
          open={selectedPatient !== null}
          patientId={selectedPatient}
          onClose={onClosePatient}
        />
      </Box>
    </Box>
  );
}

function CoordinatorStageContent({
  stage,
  summary,
  agenda,
  patients,
  weekStart,
  psychologistColors,
  onAppointmentSelect,
  onPatientSelect,
}: {
  stage: CoordinatorStage;
  summary: CoordinatorReportPageData["summary"];
  agenda: CoordinatorReportPageData["agenda"];
  patients: CoordinatorReportPageData["patients"];
  weekStart: string;
  psychologistColors: Map<number, string>;
  onAppointmentSelect: (appointment: Appointment) => void;
  onPatientSelect: (patientId: number) => void;
}) {
  switch (stage) {
    case "summary":
      return <SummaryStage rows={summary} />;

    case "patients":
      return <PatientsStage patients={patients} onSelect={onPatientSelect} />;

    case "agenda":
      return (
        <AgendaStage
          appointments={agenda}
          weekStart={weekStart}
          psychologistColors={psychologistColors}
          onSelect={onAppointmentSelect}
        />
      );

    default:
      return null;
  }
}
