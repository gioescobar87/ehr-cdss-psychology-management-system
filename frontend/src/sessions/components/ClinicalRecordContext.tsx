import { useMemo, useState } from "react";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import { useClinicalSessionContext } from "../hooks/usePatientClinicalContext";
import type { Sesion } from "../types/session.types";
import {
  buildClinicalEncounters,
  getDefaultClinicalActivity,
} from "../utils/clinicalRecord.utils";
import ClinicalRecordDetail from "./ClinicalRecordDetail";
import ClinicalRecordTimeline from "./ClinicalRecordTimeline";

interface ClinicalRecordProps {
  session: Sesion;
}

export default function ClinicalRecord({ session }: ClinicalRecordProps) {
  const {
    data: context,
    isLoading,
    isError,
  } = useClinicalSessionContext(session.id);

  const activity = useMemo(() => {
    if (!context) {
      return null;
    }

    const encounters = buildClinicalEncounters(context);
    return getDefaultClinicalActivity(encounters, context.currentSession.id);
  }, [context]);

  const encounters = useMemo(
    () => (context ? buildClinicalEncounters(context) : []),
    [context],
  );

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  const selectedActivity = useMemo(() => {
    if (!selectedActivityId) {
      return activity;
    }

    return (
      encounters
        .flatMap((encounter) => encounter.activities)
        .find((item) => item.id === selectedActivityId) ?? activity
    );
  }, [activity, encounters, selectedActivityId]);

  if (isLoading) {
    return (
      <Box
        sx={{
          minHeight: 420,
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

  return (
    <Box sx={{ minHeight: 420 }}>
      <Box sx={{ pb: 1.5, mb: 2, borderBottom: 1, borderColor: "divider" }}>
        <Typography variant="overline" color="text.secondary" fontWeight={700}>
          Historia clínica
        </Typography>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(250px, 34%) minmax(0, 1fr)",
          },
          height: { xs: "auto", md: "min(700px, calc(100vh - 280px))" },
          minHeight: 420,
          border: 1,
          borderColor: "divider",
          borderRadius: 1.5,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            borderRight: { md: 1 },
            borderColor: "divider",
          }}
        >
          {encounters.length > 0 ? (
            <ClinicalRecordTimeline
              encounters={encounters}
              selectedActivity={selectedActivity}
              onSelectActivity={(item) => setSelectedActivityId(item.id)}
            />
          ) : (
            <Box sx={{ p: 3 }}>
              <Typography variant="body2" color="text.secondary">
                No hay sesiones clínicas históricas disponibles.
              </Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,
            overflowY: "auto",
            p: { xs: 2, md: 3 },
          }}
        >
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={700}
          >
            Documentación
          </Typography>
          <Box sx={{ mt: 1.5 }}>
            <ClinicalRecordDetail activity={selectedActivity} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
