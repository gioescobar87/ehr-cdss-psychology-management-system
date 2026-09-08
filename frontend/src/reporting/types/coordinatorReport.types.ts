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
  psychologistId: number;
  psychologistName: string;
  status: string;
  fechaInicio?: string | null;
  motivoInicio?: string | null;
  fechaCierre?: string | null;
  motivoCierre?: string | null;
}

export type CoordinatorAgendaAppointment = Appointment;
