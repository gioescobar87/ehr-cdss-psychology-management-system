export interface Patient {
  id: number;
  nombre: string;
  apellido: string;
  dpi: string | null;
  fechaNacimiento: string;
  sexo: string;
  direccion: string | null;
  telefono: string | null;
  ocupacion: string | null;
  fechaRegistro: string | null;
  estadoCivilId: number | null;
  estadoCivil: string | null;
  nivelEscolaridadId: number | null;
  nivelEscolaridad: string | null;
  estadoId: number | null;
  estado: string | null;
  edad: number;
  refiere: string | null;
  fechaInicio: string | null;
  motivoConsulta: string | null;
  fechaCierre: string | null;
  motivoCierre: string | null;
}

export interface PatientRequest {
  nombre: string;
  apellido: string;
  dpi?: string;
  fechaNacimiento: string;
  sexo: string;
  direccion?: string;
  telefono?: string;
  ocupacion?: string;
  estadoCivilId?: number | null;
  nivelEscolaridadId?: number | null;
  refiere?: string;
}
