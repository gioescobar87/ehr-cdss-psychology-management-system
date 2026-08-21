import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useClinicalSessionContext } from "../hooks/usePatientClinicalContext";

import type { Sesion } from "../types/session.types";
//import type { ClinicalActivity } from "../types/clinicalRecord.types";

import {
  buildClinicalEncounters,
  getDefaultClinicalActivity,
} from "../utils/clinicalRecord.utils";

import ClinicalRecordTimeline from "./ClinicalRecordTimeline";
import ClinicalRecordDetail from "./ClinicalRecordDetail";

interface ClinicalRecordProps {
  session: Sesion;
}

function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth);
  const today = new Date();

  let age =
    today.getFullYear() -
    birthDate.getFullYear();

  const monthDifference =
    today.getMonth() -
    birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 &&
      today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

function formatSex(
  sex: string | null,
): string | null {
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

export default function ClinicalRecord({
  session,
}: ClinicalRecordProps) {
  const {
    data: context,
    isLoading,
    isError,
  } = useClinicalSessionContext(session.id);

  const [selectedActivityId, setSelectedActivityId] =
  useState<string | null>(null);

const encounters = useMemo(() => {
  if (!context) {
    return [];
  }

  return buildClinicalEncounters(context);
}, [context]);

const defaultActivity = useMemo(() => {
  if (!context || encounters.length === 0) {
    return null;
  }

  return getDefaultClinicalActivity(
    encounters,
    context.currentSession.id,
  );
}, [context, encounters]);

const selectedActivity = useMemo(() => {
  if (selectedActivityId) {
    for (const encounter of encounters) {
      const activity = encounter.activities.find(
        (item) => item.id === selectedActivityId,
      );

      if (activity) {
        return activity;
      }
    }
  }

  return defaultActivity;
}, [
  encounters,
  selectedActivityId,
  defaultActivity,
]);

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
        <Typography
          variant="body2"
          color="text.secondary"
        >
          Cargando historia clínica...
        </Typography>
      </Box>
    );
  }

  if (isError || !context) {
    return (
      <Alert severity="warning">
        No fue posible cargar el contexto clínico
        del paciente.
      </Alert>
    );
  }

  const { patient } = context;

  const age = patient.fechaNacimiento
    ? calculateAge(patient.fechaNacimiento)
    : null;

  const formattedSex = formatSex(patient.sexo);

  return (
    <Stack spacing={3}>
      {/* Patient header */}

      <Box>
        <Typography
          variant="h4"
          component="h3"
          fontWeight={700}
          sx={{
            letterSpacing: "-0.02em",
          }}
        >
          {patient.nombre}{" "}
          {patient.apellido}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          {[
            age !== null
              ? `${age} años`
              : null,
            formattedSex,
            patient.ocupacion,
          ]
            .filter(Boolean)
            .join(" · ")}
        </Typography>
      </Box>

      <Divider />

      {/* Clinical record */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(260px, 30%) minmax(0, 1fr)",
          },
          minHeight: {
            md: 560,
          },
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/* Timeline */}

        <Box
          sx={{
            borderRight: {
              xs: "none",
              md: 1,
            },
            borderBottom: {
              xs: 1,
              md: "none",
            },
            borderColor: "divider",
            p: {
              xs: 1.5,
              md: 2,
            },
            overflowY: "auto",
          }}
        >
          <Box sx={{ px: 1, pb: 1.5 }}>
            <Typography
              variant="overline"
              color="text.secondary"
              fontWeight={700}
              sx={{
                letterSpacing: 0.8,
              }}
            >
              Historia clínica
            </Typography>
          </Box>

          {encounters.length > 0 ? (
            <ClinicalRecordTimeline
              encounters={encounters}
              selectedActivity={selectedActivity}
              onSelectActivity={(activity) =>
                setSelectedActivityId(activity.id)
              }
            />
          ) : (
            <Box
              sx={{
                px: 1,
                py: 4,
              }}
            >
              <Typography
                variant="body2"
                color="text.secondary"
              >
                No hay actividades clínicas
                históricas disponibles.
              </Typography>
            </Box>
          )}
        </Box>

        {/* Detail */}

        <Box
          sx={{
            p: {
              xs: 2,
              md: 3,
            },
            overflowY: "auto",
          }}
        >
          <ClinicalRecordDetail
            activity={selectedActivity}
          />
        </Box>
      </Box>
    </Stack>
  );
}