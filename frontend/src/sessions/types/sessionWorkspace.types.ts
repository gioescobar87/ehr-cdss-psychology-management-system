export type SessionStage =
  "context" | "evaluation" | "treatmentPlan" | "evolution";

export interface SessionStageNavigationItem {
  id: SessionStage;
  label: string;
}
