import { Box, Divider, Paper, Stack, Typography } from "@mui/material";

import type { ReactNode } from "react";
import type { Sesion } from "../types/session.types";
import { SESSION_PROGRESS_HEIGHT } from "../constants/sessionStage.constants";

import SessionSummary from "./ClinicalRecordContext";
import SessionObservations from "./SessionObservations";
import SessionNotes from "./SessionNotes";
import SessionInterventions from "./SessionIntervention";
import SessionRiskEvaluation from "./SessionRiskEvaluation";
import SessionPsychologicalTests from "./SessionPsychologicalTests";
import SessionObjectives from "./SessionObjectives";

interface SessionWorkspaceProps {
  session: Sesion;
}

interface ClinicalSectionProps {
  id: string;
  title: string;
  children: ReactNode;
}

function ClinicalSection({ id, title, children }: ClinicalSectionProps) {
  return (
    <Box
      id={id}
      component="section"
      sx={{
        scrollMarginTop: `calc(
  var(--app-header-height, 64px) +
  ${SESSION_PROGRESS_HEIGHT}px +
  16px
)`,
      }}
    >
      <Typography
        variant="h5"
        component="h2"
        fontWeight={700}
        sx={{
          mb: 3,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}

interface ClinicalSubsectionProps {
  title: string;
  children: ReactNode;
}

function ClinicalSubsection({ title, children }: ClinicalSubsectionProps) {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        component="h3"
        fontWeight={700}
        sx={{
          mb: 1.5,
        }}
      >
        {title}
      </Typography>

      {children}
    </Box>
  );
}

export default function SessionWorkspace({ session }: SessionWorkspaceProps) {
  return (
    <Box
      sx={{
        flex: 1,
        px: {
          xs: 1.5,
          sm: 2,
          md: 3,
        },
        py: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          width: "100%",
          maxWidth: 1200,
          mx: "auto",
          px: {
            xs: 2,
            sm: 3,
            md: 5,
          },
          py: {
            xs: 3,
            md: 4,
          },
          borderRadius: 2,
          bgcolor: "background.paper",
          boxShadow: "none",
        }}
      >
        <Stack
          spacing={{
            xs: 4,
            md: 5,
          }}
        >
          {/* Context */}
          <ClinicalSection id="session-context" title="Contexto clínico">
            <Stack spacing={3}>
              <ClinicalSubsection title="Historia clínica2">
                <SessionSummary session={session} />
              </ClinicalSubsection>

              <ClinicalSubsection title="Observaciones">
                <SessionObservations session={session} />
              </ClinicalSubsection>
            </Stack>
          </ClinicalSection>

          <Divider />

          {/* Evaluation */}
          <ClinicalSection id="session-evaluation" title="Evaluación">
            <Stack spacing={3}>
              <ClinicalSubsection title="Evaluación de riesgo">
                <SessionRiskEvaluation session={session} />
              </ClinicalSubsection>

              <ClinicalSubsection title="Pruebas psicológicas">
                <SessionPsychologicalTests session={session} />
              </ClinicalSubsection>
            </Stack>
          </ClinicalSection>

          <Divider />

          {/* Intervention */}
          <ClinicalSection id="session-intervention" title="Intervención">
            <Stack spacing={3}>
              <ClinicalSubsection title="Intervenciones realizadas">
                <SessionInterventions session={session} />
              </ClinicalSubsection>

              <ClinicalSubsection title="Objetivos terapéuticos">
                <SessionObjectives session={session} />
              </ClinicalSubsection>
            </Stack>
          </ClinicalSection>

          <Divider />

          {/* Evolution and plan */}
          <ClinicalSection id="session-evolution" title="Evolución y plan">
            <Stack spacing={3}>
              <ClinicalSubsection title="Nota clínica">
                <SessionNotes session={session} />
              </ClinicalSubsection>
            </Stack>
          </ClinicalSection>
        </Stack>
      </Paper>
    </Box>
  );
}
