export interface Response {
  id: number;
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  orden: number;
  estadoId: number;
  estado: string;
}

export interface Request {
  nombre: string;
  descripcion?: string | null;
  icono?: string | null;
  orden: number;
}
