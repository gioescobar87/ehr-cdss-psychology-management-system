export interface Response {
  id: number;
  nombre: string;
  codigoDsm: string;
  descripcion?: string | null;
  categoriaDiagnosticaId: number;
  categoriaDiagnostica: string;
  estadoId: number;
  estado: string;
}

export interface PatientDiagnosisRequest {
  diagnosticoId: number;
  sesionId: number;
  diagnosticoInicial: boolean;
}

export interface PatientDiagnosis {
  id: number;
  pacienteId: number;
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
