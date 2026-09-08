import type { Appointment } from "../../appointments/types/appointment.types";
import type {
  CoordinatorAgendaAppointment,
  CoordinatorPatient,
  CoordinatorSummary,
} from "./coordinatorReport.types";

export type CoordinatorStage = "summary" | "agenda" | "patients";

export interface CoordinatorStageNavigationItem {
  id: CoordinatorStage;
  label: string;
}

export interface CoordinatorWorkspaceData {
  summary: CoordinatorSummary[];
  agenda: CoordinatorAgendaAppointment[];
  patients: CoordinatorPatient[];
}

export type CoordinatorReportPageData = CoordinatorWorkspaceData;

export interface CoordinatorWorkspaceSelection {
  psychologistId: number | null;
  weekStart: string;
}

export interface CoordinatorWorkspaceCallbacks {
  onWeekStartChange: (value: string) => void;
  onPsychologistChange: (value: number | null) => void;
  onAppointmentSelect: (appointment: Appointment) => void;
  onPatientSelect: (patientId: number) => void;
}
