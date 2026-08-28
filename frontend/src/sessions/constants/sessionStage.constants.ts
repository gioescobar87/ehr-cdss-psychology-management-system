import type {
  SessionStage,
  SessionStageNavigationItem,
} from "../types/sessionWorkspace.types";

export const SESSION_STAGE_ITEMS: SessionStageNavigationItem[] = [
  {
    id: "context",
    label: "Contexto",
  },
  {
    id: "evaluation",
    label: "Evaluación",
  },
  {
    id: "treatmentPlan",
    label: "Plan terapeútico",
  },
  {
    id: "evolution",
    label: "Evolución y plan",
  },
];

export const SESSION_STAGE_SECTION_IDS: Record<SessionStage, string> = {
  context: "session-context",
  evaluation: "session-evaluation",
  treatmentPlan: "session-intervention",
  evolution: "session-evolution",
};

/**
 * Height of the clinical progress navigation.
 *
 * Keep this value centralized because it is also used when calculating
 * scroll offsets for the clinical record.
 */
export const SESSION_PROGRESS_HEIGHT = 48;
