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

export interface InferenceCandidate {
  diagnosisId: number;
  diagnosis: string;
}

export interface InferenceQuestion {
  question: string;
  ruleIds: number[];
  diagnosisIds: number[];
}

export interface InferencePreparation {
  candidates: InferenceCandidate[];
  questions: InferenceQuestion[];
}

export interface InferenceAnswer {
  ruleId: number;
  value: 0 | 1;
}

export interface FinalizeInferenceRequest {
  diagnosticoSeleccionadoId: number;
  diagnosticoInicial: boolean;
  answers: InferenceAnswer[];
}

export interface FinalizeInferenceResponse {
  candidates: InferenceCandidate[];
  diagnosticoSugeridoId: number | null;
  diagnosticoSeleccionadoId: number;
  concordanciaDiagnostica: 0 | 1;
}
