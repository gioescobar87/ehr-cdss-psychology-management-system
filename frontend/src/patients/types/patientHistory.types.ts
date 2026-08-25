export interface PatientMedicalHistoryItem {
  id?: number;
  condicionMedicaId: number;
  fechaDiagnostico: string;
  tratamientoActual: string;
  observaciones?: string;
}

export interface PatientFamilyHistoryItem {
  id?: number;
  condicionMedicaId: number;
  parentescoId: number;
  observaciones?: string;
}

export interface PatientAllergyItem {
  id?: number;
  sustanciaAlergenaId: number;
  nivelSeveridadAlergiaId?: number;
  tipoReaccion?: string;
  observaciones?: string;
  estadoId: number;
}

export interface PatientMedicationItem {
  id?: number;
  medicamentoId: number;
  dosis?: string;
  frecuencia?: string;
  viaAdministracion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  prescritoPor?: string;
}

export interface PatientEmergencyContactItem {
  id?: number;
  nombre: string;
  parentescoId: number;
  telefono: string;
  direccion: string;
  observaciones?: string;
  estadoId: number;
}

export interface PatientHistoryRequest {
  antecedentesMedicos: PatientMedicalHistoryItem[];
  antecedentesFamiliares: PatientFamilyHistoryItem[];
  alergias: PatientAllergyItem[];
  medicamentos: PatientMedicationItem[];
  contactosEmergencia: PatientEmergencyContactItem[];
  eliminarAntecedentesMedicos: number[];
  eliminarAntecedentesFamiliares: number[];
  eliminarAlergias: number[];
  eliminarMedicamentos: number[];
  eliminarContactosEmergencia: number[];
}
