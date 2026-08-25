import { useState } from "react";
import { Box } from "@mui/material";

import type { Sesion } from "../../types/session.types";
import SessionNotes from "../SessionNotes";
import SessionObservations from "../SessionObservations";
import NextAppointment from "../NextAppointment";
import StageNavigator from "./StageNavigator";

interface EvolutionStageProps {
  session: Sesion;
}

export default function EvolutionStage({ session }: EvolutionStageProps) {
  const [selectedId, setSelectedId] = useState("notes");

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
        title="Evolución y plan"
        selectedId={selectedId}
        onSelect={setSelectedId}
        items={[
          { id: "notes", label: "Evolución de la sesión" },
          { id: "observations", label: "Observaciones generales" },
          { id: "next-appointment", label: "Próxima cita" },
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
        {selectedId === "notes" ? (
          <SessionNotes session={session} allowCreate={false} />
        ) : selectedId === "observations" ? (
          <SessionObservations session={session} />
        ) : (
          <NextAppointment session={session} />
        )}
      </Box>
    </Box>
  );
}
