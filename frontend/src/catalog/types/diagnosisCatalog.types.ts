export interface Diagnostico {
  id: number;
  nombre: string;
  codigoIcd: string | null;
  descripcion: string | null;
  categoriaDiagnosticaId: number;
  categoriaDiagnostica: string;
  estadoId: number;
  estado: string;
}

export interface DiagnosticoRequest {
  nombre: string;
  codigoIcd: string | null;
  descripcion: string | null;
  categoriaDiagnosticaId: number;
}
