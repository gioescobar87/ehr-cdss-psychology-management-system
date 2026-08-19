export interface ObjetivoTerapia {
  id: number;
  planTratamientoId: number;
  pacienteDiagnosticoId: number;
  pacienteId: number;
  pacienteNombre: string;
  descripcion: string;
  fechaInicio: string;
  fechaMeta?: string | null;
  estadoId: number;
  estado: string;
}

export interface SeguimientoObjetivo {
  id: number;
  objetivoTerapiaId: number;
  planTratamientoId: number;
  pacienteDiagnosticoId: number;
  sesionId: number;
  pacienteId: number;
  pacienteNombre: string;
  usuarioId: number;
  usuario: string;
  descripcionAvance: string;
  fechaRegistro: string;
}

export interface SeguimientoObjetivoRequest {
  objetivoTerapiaId: number;
  sesionId: number;
  descripcionAvance: string;
}