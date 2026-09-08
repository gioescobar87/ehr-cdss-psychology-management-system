export interface Response {
  id: number;
  nombre: string;
  descripcion?: string | null;
  estado: string;
  estadoId: number;
}

export interface Request {
  nombre: string;
  descripcion?: string | null;
}

export interface RolePermission {
  id: number;
  rolId: number;
  permisoId: number;
}
