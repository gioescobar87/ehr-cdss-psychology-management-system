import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import type { Sesion } from "../types/session.types";
import type { SessionStage } from "../types/sessionWorkspace.types";

import { useClinicalSessionContext } from "../hooks/usePatientClinicalContext";

import ClinicalSessionStepper from "./ClinicalSessionStepper";
import ClinicalStageWorkspace from "./stages/ClinicalStageWorkspace";

interface ClinicalSessionWorkspaceProps {
  session: Sesion;
  activeStage: SessionStage;
  onStageChange: (stage: SessionStage) => void;
  onBack: () => void;
}

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function formatSex(sex: string | null): string | null {
  if (!sex) {
    return null;
  }

  switch (sex.toUpperCase()) {
    case "M":
      return "Masculino";

    case "F":
      return "Femenino";

    default:
      return sex;
  }
}

export default function ClinicalSessionWorkspace({
  session,
  activeStage,
  onStageChange,
  onBack,
}: ClinicalSessionWorkspaceProps) {
  const {
    data: context,
    isLoading,
    isError,
  } = useClinicalSessionContext(session.id);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 320,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError || !context) {
    return (
      <Alert severity="warning">
        No fue posible cargar el contexto clínico del paciente.
      </Alert>
    );
  }

  const { patient } = context;

  const age = patient.fechaNacimiento
    ? calculateAge(patient.fechaNacimiento)
    : null;

  const formattedSex = formatSex(patient.sexo);

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      {/* Patient context */}

      <Box
        sx={{
          mb: 2.5,
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          fontWeight={700}
          sx={{
            letterSpacing: "-0.02em",
          }}
        >
          {patient.nombre} {patient.apellido}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mt: 0.5,
          }}
        >
          {[
            age !== null ? `${age} años` : null,
            formattedSex,
            patient.ocupacion,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Typography>
      </Box>

      {/* Clinical session workspace */}

      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          minWidth: 0,
          width: "100%",
          gap: 2,
        }}
      >
        {/* Clinical session navigation */}

        <Box
          sx={{
            display: {
              xs: "none",
              md: "block",
            },
            width: 156,
            flexShrink: 0,
            pt: 1,
          }}
        >
          <ClinicalSessionStepper
            activeStep={activeStage}
            onStepChange={onStageChange}
            onBack={onBack}
          />
        </Box>

        {/* Current clinical stage */}

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <ClinicalStageWorkspace session={session} stage={activeStage} />
        </Box>
      </Box>
    </Box>
  );
}
