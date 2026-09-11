import { useState } from "react";
import {
  Alert,
  Box,
  CircularProgress,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import type { Sesion } from "../types/session.types";
import type { SessionStage } from "../types/sessionWorkspace.types";

import { useClinicalSessionContext } from "../hooks/usePatientClinicalContext";
import { useSessionTypes } from "../hooks/useSessionTypes";
import { useUpdateSession } from "../hooks/useUpdateSession";
import { useCurrentUser } from "../../auth/hooks/useCurrentUser";

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
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useCurrentUser();
  const isCoordinator = currentUser?.roles.includes("COORDINADOR") === true;
  const restrictedToContext = isCoordinator || isCurrentUserLoading;
  const visibleStage = restrictedToContext ? "context" : activeStage;
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
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
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

        <SessionTypeSelector session={session} />
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
            activeStep={visibleStage}
            onStepChange={onStageChange}
            onBack={onBack}
            disabledSteps={restrictedToContext}
          />
        </Box>

        {/* Current clinical stage */}

        <Box
          sx={{
            minWidth: 0,
            flex: 1,
          }}
        >
          <ClinicalStageWorkspace session={session} stage={visibleStage} />
        </Box>
      </Box>
    </Box>
  );
}

function SessionTypeSelector({ session }: { session: Sesion }) {
  const { data: sessionTypes = [] } = useSessionTypes();
  const updateMutation = useUpdateSession();
  const [tipoSesionId, setTipoSesionId] = useState(session.tipoSesionId);

  const handleChange = (value: number) => {
    setTipoSesionId(value);

    updateMutation.mutate({
      id: session.id,
      request: {
        pacienteId: session.pacienteId,
        usuarioId: session.usuarioId,
        tipoSesionId: value,
        fechaSesion: session.fechaSesion,
        observacionesGenerales: session.observacionesGenerales,
        citaId: session.citaId,
      },
    });
  };

  return (
    <Select
      size="small"
      value={tipoSesionId}
      onChange={(event) => handleChange(Number(event.target.value))}
      disabled={updateMutation.isPending || sessionTypes.length === 0}
      sx={{ minWidth: 200 }}
    >
      {sessionTypes.map((type) => (
        <MenuItem key={type.id} value={type.id}>
          {type.nombre}
        </MenuItem>
      ))}
    </Select>
  );
}
