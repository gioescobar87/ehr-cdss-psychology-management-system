import { useState } from "react";
import { Box } from "@mui/material";

import type { Sesion } from "../../types/session.types";
import SessionInterventions from "../SessionIntervention";
import SessionObjectives from "../SessionObjectives";
import SessionTreatmentPlan from "../SessionTreatmentPlan";
import StageNavigator from "./StageNavigator";

interface InterventionStageProps {
  session: Sesion;
}

export default function InterventionStage({ session }: InterventionStageProps) {
  const [selectedId, setSelectedId] = useState("objectives");

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(220px, 30%) minmax(0, 1fr)",
        },
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
        title="Plan terapéutico"
        selectedId={selectedId}
        onSelect={setSelectedId}
        items={[
          { id: "objectives", label: "Objetivos terapéuticos" },
          { id: "interventions", label: "Intervenciones realizadas" },
          { id: "treatment-plan", label: "Plan terapéutico" },
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
        {selectedId === "objectives" ? (
          <SessionObjectives session={session} />
        ) : selectedId === "interventions" ? (
          <SessionInterventions session={session} allowCreate={false} />
        ) : (
          <SessionTreatmentPlan session={session} />
        )}
      </Box>
    </Box>
  );
}
