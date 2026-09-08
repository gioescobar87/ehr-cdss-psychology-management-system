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
  psychologistIds: number[];
  weekStart: string;
}

export interface CoordinatorWorkspaceCallbacks {
  onWeekStartChange: (value: string) => void;
  onPsychologistChange: (value: number[]) => void;
  onAppointmentSelect: (appointment: Appointment) => void;
  onPatientSelect: (patientId: number) => void;
}
