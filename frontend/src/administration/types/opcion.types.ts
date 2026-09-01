export interface Response {
  id: number;
  moduloId: number;
  opcionPadreId?: number | null;
  nombre: string;
  descripcion?: string | null;
  rutaFrontend: string;
  componente?: string | null;
  icono?: string | null;
  orden: number;
  visibleMenu: boolean;
  requiereAutenticacion: boolean;
  esMenuPrincipal: boolean;
  estadoId: number;
  estado: string;
}

export interface Request {
  moduloId: number;
  opcionPadreId?: number | null;
  nombre: string;
  descripcion?: string | null;
  rutaFrontend: string;
  componente?: string | null;
  icono?: string | null;
  orden: number;
  visibleMenu: boolean;
  requiereAutenticacion: boolean;
  esMenuPrincipal: boolean;
}
