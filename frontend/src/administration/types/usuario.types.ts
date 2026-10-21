export interface Response {
  id: number;
  username: string;
  nombre: string;
  apellido: string;
  correo: string;
  estadoId: number;
  estado: string;
  fechaCreacion?: string | null;
  fechaModificacion?: string | null;
  roles: UsuarioRol[];
  coordinadorId?: number | null;
  coordinadorNombre?: string | null;
}

export interface Request {
  username: string;
  nombre: string;
  apellido: string;
  correo: string;
  coordinadorId?: number | null;
}

export interface UsuarioRol {
  id: number;
  nombre: string;
}
