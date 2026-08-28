export interface SessionRequest {
  pacienteId: number;
  usuarioId: number;
  tipoSesionId: number;
  fechaSesion: string;
  observacionesGenerales?: string;
  citaId: number;
}

export interface Sesion {
  id: number;
  pacienteId: number;
  pacienteNombre: string;
  usuarioId: number;
  usuarioNombre: string;
  tipoSesionId: number;
  tipoSesion: string;
  fechaSesion: string;
  observacionesGenerales?: string;
  estadoId: number;
  estado: string;
  citaId: number;
  proximaCitaId?: number | null;
}

export interface SessionType {
  id: number;
  nombre: string;
  descripcion: string;
  estadoId: number;
  estado: string;
}
