import type { Sesion } from "../../types/session.types";

import ClinicalRecord from "../ClinicalRecordContext";

interface ContextStageProps {
  session: Sesion;
}

export default function ContextStage({ session }: ContextStageProps) {
  return <ClinicalRecord session={session} />;
}
