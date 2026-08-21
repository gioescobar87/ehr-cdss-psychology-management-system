import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import { useClinicalSessionContext } from "../hooks/usePatientClinicalContext";

import type { Sesion } from "../types/session.types";

import {
  buildClinicalEncounters,
  getDefaultClinicalActivity,
} from "../utils/clinicalRecord.utils";

import ClinicalRecordTimeline from "./ClinicalRecordTimeline";
import ClinicalRecordDetail from "./ClinicalRecordDetail";

interface ClinicalRecordProps {
  session: Sesion;
}

export default function ClinicalRecord({ session }: ClinicalRecordProps) {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const {
    data: context,
    isLoading,
    isError,
  } = useClinicalSessionContext(session.id);

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

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

    return getDefaultClinicalActivity(encounters, context.currentSession.id);
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
  }, [encounters, selectedActivityId, defaultActivity]);

  const hasExplicitSelectedActivity =
    selectedActivityId !== null && selectedActivity?.id === selectedActivityId;

  const handleSelectActivity = (activityId: string) => {
    setSelectedActivityId(activityId);
  };

  const handleBackToTimeline = () => {
    setSelectedActivityId(null);
  };

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
        <Typography variant="body2" color="text.secondary">
          Cargando historia clínica...
        </Typography>
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
    <Box>
      {/* Clinical record explorer */}

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            md: "minmax(280px, 32%) minmax(0, 1fr)",
          },

          /*
           * Desktop gets a bounded working area.
           *
           * Mobile intentionally does not use a fixed
           * height because the interaction becomes
           * list -> detail.
           */
          height: {
            xs: "auto",
            md: "min(700px, calc(100vh - 280px))",
          },

          minHeight: {
            xs: 0,
            md: 560,
          },

          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
        }}
      >
        {/*
         * MOBILE
         *
         * List -> detail navigation.
         */}
        {isMobile ? (
          hasExplicitSelectedActivity ? (
            <Box
              sx={{
                minWidth: 0,
                minHeight: 0,
                overflowY: "auto",
                p: 2,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <IconButton
                  edge="start"
                  size="small"
                  onClick={handleBackToTimeline}
                  aria-label="Volver a historia clínica"
                >
                  <ArrowBackIcon />
                </IconButton>

                <Typography variant="body2" fontWeight={700} sx={{ ml: 1 }}>
                  Historia clínica
                </Typography>
              </Box>

              <ClinicalRecordDetail activity={selectedActivity} />
            </Box>
          ) : (
            <Box
              sx={{
                minHeight: 0,
                overflowY: "auto",
                p: 1.5,
              }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  px: 1,
                  pt: 0.5,
                  pb: 1.5,
                  bgcolor: "background.paper",
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
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
                    handleSelectActivity(activity.id)
                  }
                />
              ) : (
                <Box
                  sx={{
                    px: 1,
                    py: 4,
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    No hay actividades clínicas históricas disponibles.
                  </Typography>
                </Box>
              )}
            </Box>
          )
        ) : (
          <>
            <Box
              sx={{
                minHeight: 0,
                overflowY: "auto",

                borderRight: {
                  md: 1,
                },

                borderColor: "divider",
              }}
            >
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,

                  px: {
                    xs: 2.5,
                    md: 3,
                  },
                  pt: 0.5,
                  pb: 1.5,

                  bgcolor: "background.paper",

                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
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

              <Box
                sx={{
                  p: {
                    xs: 1.5,
                    md: 2,
                  },
                }}
              >
                {encounters.length > 0 ? (
                  <ClinicalRecordTimeline
                    encounters={encounters}
                    selectedActivity={selectedActivity}
                    onSelectActivity={(activity) =>
                      handleSelectActivity(activity.id)
                    }
                  />
                ) : (
                  <Box
                    sx={{
                      px: 1,
                      py: 4,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      No hay actividades clínicas históricas disponibles.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>

            {/* Desktop detail */}
<Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,

                  px: {
                    xs: 2.5,
                    md: 3,
                  },
                  pt: 0.5,
                  pb: 1.5,

                  bgcolor: "background.paper",

                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <Typography
                  variant="overline"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{
                    letterSpacing: 0.8,
                  }}
                >
                  Documentación
                </Typography>

                <Box
              sx={{
                minWidth: 0,
                minHeight: 0,
                overflowY: "auto",

                p: {
                  xs: 2,
                  md: 3,
                },
              }}
            >
              <ClinicalRecordDetail activity={selectedActivity} />
            </Box>
              </Box>
            
          </>
        )}
      </Box>
    </Box>
  );
}
