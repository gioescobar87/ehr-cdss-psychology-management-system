export type ClinicalActivityType =
  | "session"
  | "observation"
  | "risk"
  | "psychological-test"
  | "diagnosis"
  | "objective";

export interface ClinicalActivityBase {
  id: string;
  type: ClinicalActivityType;
  title: string;
  sessionId: number | null;
}

export interface ClinicalSessionActivity
  extends ClinicalActivityBase {
  type: "session";
  sessionId: number;
}

export interface ClinicalObservationActivity
  extends ClinicalActivityBase {
  type: "observation";
  sessionId: number;
}

export interface ClinicalRiskActivity
  extends ClinicalActivityBase {
  type: "risk";
  sessionId: number;
  riskId: number;
}

export interface ClinicalPsychologicalTestActivity
  extends ClinicalActivityBase {
  type: "psychological-test";
  sessionId: number;
  testId: number;
}

export interface ClinicalDiagnosisActivity
  extends ClinicalActivityBase {
  type: "diagnosis";
  diagnosisId: number;
}

export interface ClinicalObjectiveActivity
  extends ClinicalActivityBase {
  type: "objective";
  objectiveId: number;
  sessionId: number | null;
}

export type ClinicalActivity =
  | {
      id: string;
      type: "observation";
      title: string;
      sessionId: number;
    }
  | {
      id: string;
      type: "risk";
      title: string;
      sessionId: number;
      riskId: number;
    }
  | {
      id: string;
      type: "psychological-test";
      title: string;
      sessionId: number;
      testId: number;
    }
  | {
      id: string;
      type: "diagnosis";
      title: string;
      sessionId: number;
      diagnosisId: number;
    }
  | {
      id: string;
      type: "objective";
      title: string;
      sessionId: number;
      objectiveId: number;
    };

export interface ClinicalEncounter {
  sessionId: number;
  date: string;
  sessionType: string | null;
  reason: string | null;
  activities: ClinicalActivity[];
}