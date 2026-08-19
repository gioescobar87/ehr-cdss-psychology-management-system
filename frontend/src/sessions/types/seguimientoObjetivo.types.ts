export interface SeguimientoObjetivoRequest {
  objetivoTerapiaId: number;
  sesionId: number;
  descripcionAvance: string;
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