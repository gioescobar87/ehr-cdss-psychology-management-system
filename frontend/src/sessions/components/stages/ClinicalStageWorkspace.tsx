import type { Sesion } from "../../types/session.types";
import type { SessionStage } from "../../types/sessionWorkspace.types";

import ContextStage from "./ContextStage";
import EvaluationStage from "./EvaluationStage";
import InterventionStage from "./InterventionStage";
import EvolutionStage from "./EvolutionStage";

interface ClinicalStageWorkspaceProps {
  session: Sesion;
  stage: SessionStage;
}

export default function ClinicalStageWorkspace({
  session,
  stage,
}: ClinicalStageWorkspaceProps) {
  switch (stage) {
    case "context":
      return <ContextStage session={session} />;

    case "evaluation":
      return <EvaluationStage session={session} />;

    case "intervention":
      return <InterventionStage session={session} />;

    case "evolution":
      return <EvolutionStage session={session} />;

    default:
      return null;
  }
}
