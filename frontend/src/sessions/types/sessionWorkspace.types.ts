export type SessionStage =
  "context" | "evaluation" | "intervention" | "evolution";

export interface SessionStageNavigationItem {
  id: SessionStage;
  label: string;
}
