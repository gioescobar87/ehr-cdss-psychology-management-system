export interface MedicalHistoryItem {
  id: number;
  condicionMedicaId: number;
  condicionMedica: string;
  fechaDiagnostico: string;
  tratamientoActual: string | null;
  observaciones: string | null;
}

export interface FamilyHistoryItem {
  id: number;
  condicionMedicaId: number;
  condicionMedica: string;
  parentesco: string;
  parentescoId: number;
  observaciones: string | null;
}

export interface AllergyHistoryItem {
  id: number;
  sustanciaAlergenaId: number;
  sustanciaAlergena: string | null;
  nivelSeveridadAlergiaId: number | null;
  nivelSeveridadAlergia: string | null;
  tipoReaccion: string | null;
  observaciones: string | null;
}

export interface MedicationHistoryItem {
  id: number;
  medicamentoId: number;
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  viaAdministracion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  prescritoPor: string | null;
}

export interface EmergencyContactItem {
  id: number;
  pacienteId: number;
  nombre: string;
  parentescoId: number | null;
  parentesco: string | null;
  telefono: string;
  direccion: string;
  observaciones: string | null;
  estadoId: number;
  estado: string;
}
