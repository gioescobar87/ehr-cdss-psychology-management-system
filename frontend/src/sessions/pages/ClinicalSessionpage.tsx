import { useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

import SessionHeader from "../components/SessionHeader";
import SessionNavigation from "../components/SessionNavigation";
import SessionWorkspace from "../components/SessionWorkspace";

import { useSession } from "../hooks/useSession";

import type { SessionWorkspaceSection } from "../types/sessionWorkspace.types";

export default function ClinicalSessionPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const sessionId = id ? Number(id) : undefined;

  const [activeSection, setActiveSection] =
    useState<SessionWorkspaceSection>("summary");

  const { data: session, isLoading, isError } = useSession(sessionId);

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
      <SessionHeader session={session} onBack={() => navigate("/agenda")} />

      <SessionNavigation
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <SessionWorkspace session={session} activeSection={activeSection} />
    </Box>
  );
}
