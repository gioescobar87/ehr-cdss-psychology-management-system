export interface Response {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estadoId: number;
  estado: string;
}

export interface Request {
  nombre: string;
  descripcion?: string | null;
}

export interface RolPermiso {
  id: number;
  nombre: string;
}

export interface RolOpcion {
  id: number;
  rolId: number;
  opcionId: number;
  opcion: string;
  visible: boolean;
  estadoId: number;
  estado: string;
}

export interface RolOpcionRequest {
  opcionId: number;
  visible: boolean;
  estadoId: number;
}
