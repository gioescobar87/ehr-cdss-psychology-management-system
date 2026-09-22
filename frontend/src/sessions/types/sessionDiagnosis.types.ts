export interface Response {
  id: number;
  nombre: string;
  codigoIcd: string;
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
  codigoIcd: string;
  categoriaDiagnosticaId: number;
  categoriaDiagnostica: string;
  sesionId: number | null;
  fechaDiagnostico: string;
  estadoId: number;
  estado: string;
}
