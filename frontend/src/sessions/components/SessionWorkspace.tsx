import { Box, Card, CardContent, Stack, Typography } from "@mui/material";

import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import TrackChangesOutlinedIcon from "@mui/icons-material/TrackChangesOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";

import type { SessionWorkspaceSection } from "../types/sessionWorkspace.types";
import type { Sesion } from "../types/session.types";

import SessionSummary from "./SessionSummary";
import SessionObservations from "./SessionObservations";
import SessionNotes from "./SessionNotes";
import SessionInterventions from "./SessionIntervention";
import SessionRiskEvaluation from "./SessionRiskEvaluation";
import SessionPsychologicalTests from "./SessionPsychologicalTests";
import SessionObjectives from "./SessionObjectives";

interface SessionWorkspaceProps {
  session: Sesion;
  activeSection: SessionWorkspaceSection;
}

interface SectionPlaceholder {
  title: string;
  description: string;
  icon: typeof DescriptionOutlinedIcon;
}

const SECTION_PLACEHOLDERS: Record<
  SessionWorkspaceSection,
  SectionPlaceholder
> = {
  summary: {
    title: "Resumen de la sesión",
    description:
      "Aquí se mostrará un resumen clínico de la sesión y la información relevante del paciente.",
    icon: DescriptionOutlinedIcon,
  },

  observations: {
    title: "Observaciones generales",
    description:
      "Aquí se registrarán las observaciones generales correspondientes a esta sesión.",
    icon: DescriptionOutlinedIcon,
  },

  notes: {
    title: "Notas de sesión",
    description:
      "Aquí se registrarán las notas clínicas correspondientes a esta sesión.",
    icon: NotesOutlinedIcon,
  },

  interventions: {
    title: "Intervenciones",
    description:
      "Aquí se registrarán las intervenciones realizadas durante la sesión.",
    icon: PsychologyOutlinedIcon,
  },

  risk: {
    title: "Evaluación de riesgo",
    description:
      "Aquí se gestionarán las evaluaciones de riesgo asociadas a la sesión.",
    icon: WarningAmberOutlinedIcon,
  },

  tests: {
    title: "Pruebas psicológicas",
    description:
      "Aquí se registrarán y consultarán las pruebas psicológicas relacionadas con la sesión.",
    icon: AssignmentOutlinedIcon,
  },

  objectives: {
    title: "Objetivos terapéuticos",
    description:
      "Aquí se visualizarán y gestionarán los objetivos terapéuticos relacionados con la sesión.",
    icon: TrackChangesOutlinedIcon,
  },

  diagnosis: {
    title: "Diagnóstico",
    description:
      "Aquí se gestionará la información diagnóstica asociada a la sesión.",
    icon: MedicalInformationOutlinedIcon,
  },
};

export default function SessionWorkspace({
  session,
  activeSection,
}: SessionWorkspaceProps) {
  const section = SECTION_PLACEHOLDERS[activeSection];

  const Icon = section.icon;

  return (
    <Box
      sx={{
        flex: 1,
        px: {
          xs: 2,
          md: 3,
        },
        py: {
          xs: 3,
          md: 4,
        },
      }}
    >
      {activeSection === "summary" ? (
        <SessionSummary session={session} />
      ) : activeSection === "observations" ? (
        <SessionObservations session={session} />
      ) : activeSection === "notes" ? (
        <SessionNotes session={session} />
      ) : activeSection === "interventions" ? (
        <SessionInterventions session={session} />
      ) : activeSection === "risk" ? (
        <SessionRiskEvaluation session={session} />
      ) : activeSection === "tests" ? (
        <SessionPsychologicalTests session={session} />
      ) : activeSection === "objectives" ? (
        <SessionObjectives session={session} />
      ) : (
        <Card
          variant="outlined"
          sx={{
            minHeight: {
              xs: 320,
              md: 420,
            },
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Stack
              spacing={1.5}
              alignItems="center"
              textAlign="center"
              sx={{
                maxWidth: 520,
                mx: "auto",
              }}
            >
              <Icon
                sx={{
                  fontSize: 48,
                  color: "text.disabled",
                }}
              />

              <Typography variant="h6" fontWeight={700}>
                {section.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  maxWidth: 480,
                }}
              >
                {section.description}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Box>
  );
}
