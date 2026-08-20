import { useCallback, useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import SessionHeader from "../components/SessionHeader";
import SessionProgress from "../components/SessionProgress";
import SessionWorkspace from "../components/SessionWorkspace";

import { useSession } from "../hooks/useSession";
import { useSessionStageObserver } from "../hooks/useSessionStageObserver";

import type { SessionStage } from "../types/sessionWorkspace.types";

export default function ClinicalSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const sessionId = id ? Number(id) : undefined;

  const [activeStage, setActiveStage] = useState<SessionStage>("context");

  const handleStageChange = useCallback((stage: SessionStage) => {
    setActiveStage(stage);
  }, []);

  const { data: session, isLoading, isError } = useSession(sessionId);

  useSessionStageObserver({
    enabled: Boolean(session),
    onStageChange: handleStageChange,
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !session) {
    return (
      <Alert severity="error">No fue posible cargar la sesión clínica.</Alert>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.default",
      }}
    >
      <SessionHeader session={session} onBack={() => navigate("/citas")} />

      <SessionProgress activeStage={activeStage} />

      <SessionWorkspace session={session} />
    </Box>
  );
}
