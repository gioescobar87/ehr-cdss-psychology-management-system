import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PatientDetailsDialog from "../../patients/components/PatientDetailsDialog";
import PatientMotivoConsultaDialog from "./PatientMotivoConsultaDialog";

import {
  useClinicalSessionContext,
  useUpdatePatientMotivoConsulta,
} from "../hooks/usePatientClinicalContext";

import type { Sesion } from "../types/session.types";
import {
  buildClinicalEncounters,
  getDefaultClinicalActivity,
} from "../utils/clinicalRecord.utils";
import type { ClinicalActivity } from "../types/clinicalRecord.types";
import ClinicalRecordDetail from "./ClinicalRecordDetail";
import ClinicalRecordTimeline from "./ClinicalRecordTimeline";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import SessionSymptomsReadOnlyDialog from "./SessionSymptomsReadOnlyDialog";

interface ClinicalRecordProps {
  session: Sesion;
}

export default function ClinicalRecord({ session }: ClinicalRecordProps) {
  const {
    data: context,
    isLoading,
    isError,
  } = useClinicalSessionContext(session.id);

  const updateMotivoConsulta = useUpdatePatientMotivoConsulta();

  const encounters = useMemo(
    () => (context ? buildClinicalEncounters(context) : []),
    [context],
  );

  const defaultActivity = useMemo(
    () =>
      context
        ? getDefaultClinicalActivity(encounters, context.currentSession.id)
        : null,
    [context, encounters],
  );

  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const [patientDialogOpen, setPatientDialogOpen] = useState(false);
  const [symptomsDialogOpen, setSymptomsDialogOpen] = useState(false);
  const [motivoConsultaDialogOpen, setMotivoConsultaDialogOpen] =
    useState(false);

  const motivoConsulta = context?.patient.motivoConsulta?.trim() ?? "";
  const tieneMotivoConsulta = Boolean(motivoConsulta);

  const handleSaveMotivoConsulta = async (motivoConsulta: string) => {
    await updateMotivoConsulta.mutateAsync({
      patientId: session.pacienteId,
      motivoConsulta,
    });

    setMotivoConsultaDialogOpen(false);
  };

  const selectedActivity = useMemo(
    () =>
      encounters
        .flatMap((encounter) => encounter.activities)
        .find((activity) => activity.id === selectedActivityId) ??
      defaultActivity,
    [defaultActivity, encounters, selectedActivityId],
  );

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
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(220px, 30%) minmax(0, 1fr)",
        },
        height: { xs: "auto", md: 560 },
        minHeight: { xs: 400, md: 560 },
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr)",
          minWidth: 0,
          minHeight: 0,
          height: "100%",
          overflowY: "auto",
          borderRight: { xs: 0, md: 1 },
          borderBottom: { xs: 1, md: 0 },
          borderColor: "divider",
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={700}
          >
            Historial clínico
          </Typography>
        </Box>

        <Box sx={{ minHeight: 0, overflowY: "auto" }}>
          {encounters.length > 0 ? (
            <ClinicalRecordTimeline
              encounters={encounters}
              selectedActivity={selectedActivity}
              onSelectActivity={(activity: ClinicalActivity) =>
                setSelectedActivityId(activity.id)
              }
            />
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
              No hay sesiones clínicas históricas disponibles.
            </Typography>
          )}
        </Box>
      </Box>

      <Box
        sx={{
          minWidth: 0,
          minHeight: 0,
          overflowY: "auto",
          p: { xs: 2, md: 3 },
        }}
      >
        {encounters.length > 0 ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                flexWrap: "wrap",
                pb: 1.5,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}
              >
                Documentación
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  color="secondary"
                  startIcon={<HealingOutlinedIcon />}
                  onClick={() => setSymptomsDialogOpen(true)}
                >
                  Sintomatología
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  color={tieneMotivoConsulta ? "success" : "error"}
                  startIcon={
                    tieneMotivoConsulta ? (
                      <VisibilityOutlinedIcon />
                    ) : (
                      <AssignmentOutlinedIcon />
                    )
                  }
                  onClick={() => setMotivoConsultaDialogOpen(true)}
                  sx={{
                    fontWeight: 700,
                    borderWidth: 2,
                    ...(tieneMotivoConsulta
                      ? {
                          "&:hover": {
                            borderWidth: 2,
                          },
                        }
                      : {
                          boxShadow: 2,
                          "&:hover": {
                            borderWidth: 2,
                            boxShadow: 4,
                          },
                        }),
                  }}
                >
                  {tieneMotivoConsulta
                    ? "Motivo de consulta"
                    : "Motivo consulta"}
                </Button>

                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<VisibilityOutlinedIcon />}
                  onClick={() => setPatientDialogOpen(true)}
                >
                  Paciente
                </Button>
              </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
              <ClinicalRecordDetail activity={selectedActivity} />
            </Box>
          </>
        ) : null}
      </Box>

      <PatientDetailsDialog
        open={patientDialogOpen}
        patientId={session.pacienteId}
        onClose={() => setPatientDialogOpen(false)}
      />

      <SessionSymptomsReadOnlyDialog
        open={symptomsDialogOpen}
        session={session}
        onClose={() => setSymptomsDialogOpen(false)}
      />

      <PatientMotivoConsultaDialog
        open={motivoConsultaDialogOpen}
        initialValue={context.patient.motivoConsulta}
        readOnly={tieneMotivoConsulta}
        loading={updateMotivoConsulta.isPending}
        error={
          updateMotivoConsulta.error instanceof Error
            ? updateMotivoConsulta.error.message
            : null
        }
        onClose={() => setMotivoConsultaDialogOpen(false)}
        onConfirm={handleSaveMotivoConsulta}
      />
    </Box>
  );
}
