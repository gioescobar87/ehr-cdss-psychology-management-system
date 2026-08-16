export type SessionWorkspaceSection =
  | "summary"
  | "observations"
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
