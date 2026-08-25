import { useState } from "react";
import { Box } from "@mui/material";

import type { Sesion } from "../../types/session.types";
import SessionPsychologicalTests from "../SessionPsychologicalTests";
import SessionRiskEvaluation from "../SessionRiskEvaluation";
import SessionSymptoms from "../SessionSymptoms";
import SessionDiagnoses from "../SessionDiagnoses";
import StageNavigator from "./StageNavigator";

interface EvaluationStageProps {
  session: Sesion;
}

export default function EvaluationStage({ session }: EvaluationStageProps) {
  const [selectedId, setSelectedId] = useState("tests");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(220px, 30%) minmax(0, 1fr)",
        },
        height: { xs: "auto", md: 560 },
        minHeight: {
          xs: 400,
          md: 560,
        },
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <StageNavigator
        title="Evaluación"
        selectedId={selectedId}
        onSelect={setSelectedId}
        items={[
          { id: "symptoms", label: "Síntomas" },
          { id: "tests", label: "Pruebas psicológicas" },
          { id: "risk", label: "Riesgos" },
          { id: "diagnoses", label: "Diagnósticos" },
        ]}
      />
      <Box
        sx={{
          minWidth: 0,
          minHeight: 0,
          overflowY: "auto",
          p: { xs: 2, md: 3 },
        }}
      >
        {selectedId === "symptoms" ? (
          <SessionSymptoms session={session} />
        ) : selectedId === "diagnoses" ? (
          <SessionDiagnoses session={session} />
        ) : selectedId === "tests" ? (
          <SessionPsychologicalTests session={session} allowCreate />
        ) : (
          <SessionRiskEvaluation session={session} allowCreate />
        )}
      </Box>
    </Box>
  );
}
