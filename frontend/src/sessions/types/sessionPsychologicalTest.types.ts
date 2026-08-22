export interface SessionPsychologicalTest {
  id: number;
  sesionId: number;
  pruebaPsicologicaId: number;
  fechaAplicacion: string;
  archivoAdjunto?: string | null;
  interpretacion?: string | null;
  estadoId: number;
  estado: string;
}

export interface SessionPsychologicalTestRequest {
  sesionId: number;
  pruebaPsicologicaId: number;
  archivoAdjunto?: string;
  interpretacion?: string;
}