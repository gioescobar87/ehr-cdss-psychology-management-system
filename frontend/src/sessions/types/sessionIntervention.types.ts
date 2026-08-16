export interface SessionIntervention {
  id: number;
  sesionId: number;
  intervencionId: number;
  intervencion: string;
  tipoIntervencionId: number;
  tipoIntervencion: string;
}

export interface SessionInterventionRequest {
  sesionId: number;
  intervencionId: number;
}

export interface InterventionType {
  id: number;
  nombre: string;
  descripcion: string;
  estadoId: number;
  estado: string;
}

export interface Intervention {
  id: number;
  nombre: string;
  tipoIntervencionId: number;
  tipoIntervencion: string;
  descripcion: string;
  estadoId: number;
  estado: string;
}
