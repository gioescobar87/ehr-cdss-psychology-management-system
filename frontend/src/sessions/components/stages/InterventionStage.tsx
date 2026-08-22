import { useState } from "react";
import { Box } from "@mui/material";

import type { Sesion } from "../../types/session.types";
import SessionInterventions from "../SessionIntervention";
import SessionObjectives from "../SessionObjectives";
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
        title="Intervención"
        selectedId={selectedId}
        onSelect={setSelectedId}
        items={[
          { id: "objectives", label: "Objetivos terapéuticos" },
          { id: "interventions", label: "Intervenciones realizadas" },
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
        ) : (
          <SessionInterventions session={session} allowCreate={false} />
        )}
      </Box>
    </Box>
  );
}
