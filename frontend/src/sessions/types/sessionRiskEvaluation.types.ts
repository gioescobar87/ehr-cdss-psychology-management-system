export interface RiskType {
  id: number;
  nombre: string;
  descripcion: string;
  estadoId: number;
  estado: string;
}

export interface RiskLevel {
  id: number;
  nombre: string;
  descripcion: string;
  estadoId: number;
  estado: string;
}

export interface SessionRiskEvaluation {
  id: number;
  pacienteId: number;
  sesionId: number;
  tipoRiesgoId: number;
  tipoRiesgo: string;
  nivelRiesgoId: number;
  nivelRiesgo: string;
  observaciones: string | null;
  fecha: string;
}

export interface RiskEvaluationRequest {
  pacienteId: number;
  sesionId: number;
  tipoRiesgoId: number;
  nivelRiesgoId: number;
  observaciones?: string;
  fecha: string;
}
