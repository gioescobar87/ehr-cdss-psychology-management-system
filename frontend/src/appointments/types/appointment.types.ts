export interface AppointmentRequest {
  pacienteId: number;
  usuarioId: number;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  motivo?: string;
  observaciones?: string;
  estadoId: number;
}

export interface Appointment {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  motivo?: string;
  observaciones?: string;
  estadoId: number;
  estado: string;
}

export interface CancellationRequest {
  motivoCancelacion: string;
  solicitudPaciente: boolean;
}

export interface RescheduleRequest {
  motivoCancelacion: string;
  solicitudPaciente: boolean;
  nuevaFechaHoraInicio: string;
}

export interface Cancellation {
  id: number;
  citaId: number;
  usuarioId: number;
  usuarioNombre: string;
  motivoCancelacion: string;
  fechaCancelacion: string;
  solicitudPaciente: boolean;
}

export interface PatientAssignment {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  psicologoId: number;
  psicologoNombre: string;
  usuarioCambioId?: number;
  usuarioCambioNombre?: string;
  fechaAsignacion: string;
  fechaFin?: string | null;
  motivoAsignacion?: string;
  justificacionReasignacion?: string;
}

export interface AppointmentFormValues {
  pacienteId: number | null;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  motivo: string;
  observaciones: string;
}

export interface Appointment {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  fechaHoraInicio: string;
  fechaHoraFin: string;
  motivo?: string;
  observaciones?: string;
  estadoId: number;
  estado: string;
  tieneSesion: boolean;
  sesionId?: number | null;
}
