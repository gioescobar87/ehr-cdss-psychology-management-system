export interface SesionPaciente {
  id: number;
  pacienteId: number;
  tipoSesionId: number;
  tipoSesion?: string;
  fechaSesion: string;
}

export interface DiagnosticoPaciente {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  diagnosticoId: number;
  diagnostico: string;
  codigoDsm: string;
  categoriaDiagnosticaId: number;
  categoriaDiagnostica: string;
  sesionId: number | null;
  fechaDiagnostico: string;
  estadoId: number;
  estado: string;
}

export interface ObjetivoTerapia {
  id: number;
  planTratamientoId: number;
  pacienteDiagnosticoId: number;
  pacienteId: number;
  pacienteNombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaMeta: string;
  estadoId: number;
  estado: string;
}

export interface EvaluacionRiesgo {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  sesionId: number | null;
  tipoRiesgoId: number;
  tipoRiesgo: string;
  nivelRiesgoId: number;
  nivelRiesgo: string;
  observaciones: string | null;
  fecha: string;
}

export interface SessionNote {
  id: number;
  sesionId: number;
  usuarioId: number;
  usuarioNombre: string;
  contenido: string;
  tipoNota?: string;
  fechaRegistro: string;
}

export interface SessionNoteRequest {
  sesionId: number;
  contenido: string;
  tipoNota?: string;
}