export interface PlanTratamiento {
  id: number;
  pacienteDiagnosticoId: number;
  pacienteId: number;
  pacienteNombre: string;
  diagnosticoId: number;
  diagnostico: string;
  codigoDsm?: string | null;
  descripcionGeneral?: string | null;
  fechaInicio: string;
  fechaFin?: string | null;
  estadoId: number;
  estado: string;
}
