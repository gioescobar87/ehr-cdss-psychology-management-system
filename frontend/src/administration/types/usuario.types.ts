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
}

export interface Request {
  username: string;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface UsuarioRol {
  id: number;
  nombre: string;
}
