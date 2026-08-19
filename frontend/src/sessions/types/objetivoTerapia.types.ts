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