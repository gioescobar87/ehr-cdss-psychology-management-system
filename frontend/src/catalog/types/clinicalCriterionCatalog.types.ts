export interface CriterioClinico {
  id: number;
  nombre: string;
  descripcion: string | null;
  categoriaCriterioClinicoId: number;
  categoriaCriterioClinico: string;
  estadoId: number;
  estado: string;
}

export interface CriterioClinicoRequest {
  nombre: string;
  descripcion: string | null;
  categoriaCriterioClinicoId: number;
}
