export interface ClinicalCriterion {
  id: number;
  nombre: string;
  codigo: string;
  descripcion?: string | null;
  categoriaCriterioClinico?: string | null;
  estado: string;
}

export interface DiagnosticEvaluation {
  id: number;
  sesionId: number;
  diagnosticoFinalId: number | null;
  diagnosticoFinal?: string | null;
  estadoId: number;
  estado: string;
}

export interface SessionSymptom {
  id: number;
  sesionId: number;
  criterioClinicoId: number;
  criterioCodigo: string;
  criterioNombre: string;
  categoriaCriterioId: number | null;
  categoriaCriterio: string | null;
  observaciones: string | null;
  presente: boolean;
}

export interface SessionSymptomRequest {
  sesionId: number;
  criterioClinicoId: number;
  presente: boolean;
}

export interface SessionSymptomBatchRequest {
  sesionId: number;
  criterioClinicoIds: number[];
}
