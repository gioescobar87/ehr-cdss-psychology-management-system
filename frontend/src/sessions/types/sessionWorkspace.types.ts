export type SessionWorkspaceSection =
  | "summary"
  | "notes"
  | "interventions"
  | "risk"
  | "tests"
  | "objectives"
  | "diagnosis";

export interface SessionWorkspaceNavigationItem {
  id: SessionWorkspaceSection;
  label: string;
}
