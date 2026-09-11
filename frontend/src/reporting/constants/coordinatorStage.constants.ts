import type {
  CoordinatorStage,
  CoordinatorStageNavigationItem,
} from "../types/coordinatorWorkspace.types";

export const COORDINATOR_STAGE_ITEMS: CoordinatorStageNavigationItem[] = [
  { id: "summary", label: "Resumen por psicólogo" },
  { id: "patients", label: "Pacientes / ciclo de servicio" },
  { id: "agenda", label: "Agenda semanal" },
  { id: "cancellations", label: "Cancelaciones" },
];

export const COORDINATOR_STAGE_LABELS: Record<CoordinatorStage, string> = {
  summary: "Resumen por psicólogo",
  patients: "Pacientes / ciclo de servicio",
  agenda: "Agenda semanal",
  cancellations: "Cancelaciones",
};
