export interface ClinicalContextPatient {
  id: number;
  nombre: string;
  apellido: string;
  dpi: string | null;
  fechaNacimiento: string;
  sexo: string | null;
  telefono: string | null;
  direccion: string | null;
  ocupacion: string | null;
  estadoCivil: string | null;
  nivelEscolaridad: string | null;
}

export interface ClinicalContextSession {
  id: number;
  fechaSesion: string;
  tipoSesion: string | null;
  estado: string | null;
  citaId: number | null;
  motivoCita: string | null;
}

export interface ClinicalContextDiagnosis {
  id: number;
  diagnosticoId: number;
  nombre: string;
  codigoIcd: string | null;
  categoriaDiagnostica: string | null;
  fechaDiagnostico: string;
  sesionId: number;
}

export interface ClinicalContextAllergy {
  id: number;
  sustanciaAlergena: string | null;
  nivelSeveridad: string | null;
  tipoReaccion: string | null;
  observaciones: string | null;
}

export interface ClinicalContextPsychologicalTest {
  id: number;
  pruebaPsicologicaId: number | null;
  pruebaNombre: string | null;
  fechaAplicacion: string;
  sesionId: number | null;
}

export interface ClinicalContextRisk {
  id: number;
  tipoRiesgoId: number | null;
  tipoRiesgo: string | null;
  nivelRiesgoId: number | null;
  nivelRiesgo: string | null;
  observaciones: string | null;
  fecha: string;
  sesionId: number | null;
}

export interface ClinicalContextObjective {
  id: number;
  descripcion: string;
  fechaInicio: string;
  fechaMeta: string;
  estado: string | null;
}

export interface ClinicalContextPreview<T> {
  items: T[];
  total: number;
}

export interface ClinicalSessionContext {
  patient: ClinicalContextPatient;
  currentSession: ClinicalContextSession;

  diagnoses: ClinicalContextDiagnosis[];
  allergies: ClinicalContextAllergy[];

  psychologicalTests: ClinicalContextPreview<ClinicalContextPsychologicalTest>;

  risks: ClinicalContextPreview<ClinicalContextRisk>;

  objectives: ClinicalContextPreview<ClinicalContextObjective>;

  recentSessions: ClinicalContextPreview<ClinicalContextSession>;
}
