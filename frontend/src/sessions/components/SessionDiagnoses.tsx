import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";

import type { Sesion } from "../types/session.types";
import { useDiagnoses } from "../hooks/useSessionDiagnoses";
import { usePatientDiagnoses } from "../hooks/usePatientClinicalContext";
import SessionDiagnosisDialog from "./SessionDiagnosisDialog";

interface SessionDiagnosesProps {
  session: Sesion;
}

export default function SessionDiagnoses({ session }: SessionDiagnosesProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data: diagnoses = [],
    isLoading: loadingDiagnoses,
    isError: diagnosesError,
  } = useDiagnoses();
  const {
    data: patientDiagnoses = [],
    isLoading: loadingPatientDiagnoses,
    isError: patientDiagnosesError,
  } = usePatientDiagnoses(session.pacienteId);
  const isLoading = loadingDiagnoses || loadingPatientDiagnoses;
  const hasError = diagnosesError || patientDiagnosesError;
  const sessionDiagnoses = useMemo(
    () =>
      patientDiagnoses.filter((diagnosis) => diagnosis.sesionId === session.id),
    [patientDiagnoses, session.id],
  );
  const orderedDiagnoses = useMemo(
    () =>
      [...sessionDiagnoses].sort(
        (a, b) =>
          new Date(b.fechaDiagnostico).getTime() -
          new Date(a.fechaDiagnostico).getTime(),
      ),
    [sessionDiagnoses],
  );

  return (
    <>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <MedicalInformationOutlinedIcon color="primary" />
              <Typography variant="h5" fontWeight={700}>
                Diagnósticos
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Diagnósticos identificados y seleccionados durante esta sesión.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PlaylistAddCheckOutlinedIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={isLoading}
          >
            Diagnosticar
          </Button>
        </Box>
        {hasError && (
          <Alert severity="error">
            No fue posible cargar los diagnósticos.
          </Alert>
        )}
        {isLoading ? (
          <Card variant="outlined">
            <CardContent
              sx={{
                minHeight: 240,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </CardContent>
          </Card>
        ) : orderedDiagnoses.length === 0 ? (
          <EmptyDiagnosesState onCreate={() => setDialogOpen(true)} />
        ) : (
          <Box
            sx={{
              maxHeight: { xs: "none", md: "calc(100vh - 390px)" },
              overflowY: { xs: "visible", md: "auto" },
              pr: { md: 1 },
            }}
          >
            <Stack divider={<Divider flexItem />} spacing={0}>
              {orderedDiagnoses.map((diagnosis) => (
                <Box key={diagnosis.id} sx={{ py: 1.5 }}>
                  <Typography variant="body1" fontWeight={700}>
                    {diagnosis.diagnostico}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {diagnosis.codigoIcd}
                    {diagnosis.categoriaDiagnostica
                      ? ` · ${diagnosis.categoriaDiagnostica}`
                      : ""}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Box>
        )}
      </Stack>
      <SessionDiagnosisDialog
        open={dialogOpen}
        sessionId={session.id}
        diagnoses={diagnoses}
        existingDiagnoses={patientDiagnoses}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

function EmptyDiagnosesState({ onCreate }: { onCreate: () => void }) {
  return (
    <Box
      sx={{
        py: 5,
        borderTop: 1,
        borderBottom: 1,
        borderColor: "divider",
        textAlign: "center",
      }}
    >
      <MedicalInformationOutlinedIcon
        sx={{ fontSize: 44, color: "text.disabled" }}
      />
      <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
        No hay diagnósticos registrados
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Agregue el primer diagnóstico identificado.
      </Typography>
      <Button
        variant="outlined"
        startIcon={<PlaylistAddCheckOutlinedIcon />}
        onClick={onCreate}
        sx={{ mt: 2 }}
      >
        Diagnosticar
      </Button>
    </Box>
  );
}
