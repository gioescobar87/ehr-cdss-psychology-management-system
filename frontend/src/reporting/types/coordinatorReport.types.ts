import type { Appointment } from "../../appointments/types/appointment.types";

export interface CoordinatorSummary {
  psychologistId: number;
  psychologistName: string;
  patientCount: number;
  appointmentCount: number;
  attendedCount: number;
  cancelledCount: number;
  cancellationRate: number;
}

export interface CoordinatorPatient {
  patientId: number;
  patientName: string;
  age?: number | null;
  psychologistId: number;
  psychologistName: string;
  status: string;
  startDate?: string | null;
  startReason?: string | null;
  closingDate?: string | null;
  closingReason?: string | null;
  referralSource?: string | null;
  ultimaSesionId?: number | null;
  diagnoses: CoordinatorPatientDiagnosis[];
}

export interface CoordinatorPatientDiagnosis {
  diagnosisId: number;
  code?: string | null;
  name: string;
  diagnosisDate?: string | null;
  initial?: boolean | null;
}

export type CoordinatorAgendaAppointment = Appointment;

export interface CoordinatorCancellation {
  id: number;
  citaId: number;
  patientId: number;
  patientName: string;
  psychologistId: number;
  psychologistName: string;
  cancelledByUserId?: number | null;
  cancelledByUserName?: string | null;
  cancellationDate: string;
  reason: string;
  requestedByPatient: boolean;
  appointmentDate: string;
  appointmentReason?: string | null;
}

export interface CoordinatorDiagnosticAgreement {
  id: number;
  sessionId: number;
  patientId: number;
  patientName: string;
  psychologistId: number;
  psychologistName: string;
  suggestedDiagnosis?: string | null;
  selectedDiagnosis?: string | null;
  concordanciaDiagnostica: 0 | 1 | null;
  fechaHoraInferencia: string;
}
