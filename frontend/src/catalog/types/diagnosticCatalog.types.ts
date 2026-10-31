export interface CatalogReference {
  id: number;
  nombre: string;
}

export interface DiagnosticoCriterioClinico {
  id: number;
  diagnosticoId: number;
  diagnostico: string;
  criterioClinicoId: number;
  criterioClinico: string;
  referenciaRegla: string | null;
}

export interface DiagnosticoCriterioClinicoRequest {
  diagnosticoId: number;
  criterioClinicoId: number;
  referenciaRegla: string | null;
}

export interface DiagnosticoRegla {
  id: number;
  diagnosticoId: number;
  diagnostico: string;
  tipoReglaId: number;
  tipoRegla: string;
  valorRegla: number;
  operadorId: number;
  operador: string;
  parametro: string | null;
}

export interface DiagnosticoReglaRequest {
  diagnosticoId: number;
  tipoReglaId: number;
  valorRegla: number;
  operadorId: number;
  parametro: string;
}
