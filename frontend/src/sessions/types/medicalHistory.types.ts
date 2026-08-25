export interface MedicalHistoryItem {
  id: number;
  condicionMedica: string;
  fechaDiagnostico: string;
  tratamientoActual: string | null;
  observaciones: string | null;
}

export interface FamilyHistoryItem {
  id: number;
  condicionMedica: string;
  parentesco: string;
  observaciones: string | null;
}

export interface AllergyHistoryItem {
  id: number;
  sustanciaAlergena: string | null;
  nivelSeveridadAlergia: string | null;
  tipoReaccion: string | null;
  observaciones: string | null;
}

export interface MedicationHistoryItem {
  id: number;
  medicamento: string;
  dosis: string | null;
  frecuencia: string | null;
  viaAdministracion: string | null;
  fechaInicio: string | null;
  fechaFin: string | null;
  prescritoPor: string | null;
}
