export interface PsychologicalTest {
  id: number;
  nombre: string;
  descripcion?: string | null;
  objetivoPrueba: string;
  instruccionesAplicacion: string;
  consideraciones?: string | null;
  estadoId: number;
  estado: string;
}
