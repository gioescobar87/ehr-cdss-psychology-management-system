import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
} from "@mui/material";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import type { Sesion } from "../types/session.types";
import type { SessionSymptom } from "../types/sessionSymptom.types";
import {
  useClinicalCriteria,
  usePatientSymptoms,
  useUpdateSessionSymptom,
} from "../hooks/useSessionSymptoms";
import SessionSymptomDialog from "./SessionSymptomDialog";

interface SessionSymptomsProps {
  session: Sesion;
}

export default function SessionSymptoms({ session }: SessionSymptomsProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    data: allSymptoms = [],
    isLoading: loadingSymptoms,
    isError: symptomsError,
  } = usePatientSymptoms(session.pacienteId);
  const {
    data: criteria = [],
    isLoading: loadingCriteria,
    isError: criteriaError,
  } = useClinicalCriteria();
  const updateMutation = useUpdateSessionSymptom();

  const visibleSymptoms = useMemo(
    () => allSymptoms.filter((symptom) => symptom.presente),
    [allSymptoms],
  );

  const handlePresenceChange = (symptom: SessionSymptom, presente: boolean) => {
    updateMutation.mutate({
      id: symptom.id,
      request: {
        sesionId: symptom.sesionId,
        criterioClinicoId: symptom.criterioClinicoId,
        presente,
      },
    });
  };

  const isLoading = loadingSymptoms || loadingCriteria;
  const hasError = symptomsError || criteriaError;

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
              <HealingOutlinedIcon color="primary" />
              <Typography variant="h5" fontWeight={700}>
                Síntomas
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Síntomas identificados en el historial clínico del paciente.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PlaylistAddCheckOutlinedIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={isLoading}
          >
            Seleccionar síntomas
          </Button>
        </Box>

        {hasError && (
          <Alert severity="error">
            No fue posible cargar los síntomas del paciente.
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
        ) : visibleSymptoms.length === 0 ? (
          <EmptySymptomsState onCreate={() => setDialogOpen(true)} />
        ) : (
          <Box
            sx={{
              maxHeight: { xs: "none", md: "calc(100vh - 390px)" },
              overflowY: { xs: "visible", md: "auto" },
              pr: { md: 1 },
            }}
          >
            <Stack divider={<Divider flexItem />} spacing={0}>
              {visibleSymptoms.map((symptom) => (
                <SymptomRow
                  key={symptom.id}
                  symptom={symptom}
                  isUpdating={
                    updateMutation.isPending &&
                    updateMutation.variables?.id === symptom.id
                  }
                  onPresenceChange={handlePresenceChange}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Stack>

      <SessionSymptomDialog
        open={dialogOpen}
        sessionId={session.id}
        criteria={criteria}
        existingSymptoms={allSymptoms}
        onClose={() => setDialogOpen(false)}
      />
    </>
  );
}

function EmptySymptomsState({ onCreate }: { onCreate: () => void }) {
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
      <HealingOutlinedIcon sx={{ fontSize: 44, color: "text.disabled" }} />
      <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
        No hay síntomas presentes
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Agregue el primer síntoma identificado.
      </Typography>
      <Button
        variant="outlined"
        startIcon={<PlaylistAddCheckOutlinedIcon />}
        onClick={onCreate}
        sx={{ mt: 2 }}
      >
        Seleccionar síntomas
      </Button>
    </Box>
  );
}

interface SymptomRowProps {
  symptom: SessionSymptom;
  isUpdating: boolean;
  onPresenceChange: (symptom: SessionSymptom, presente: boolean) => void;
}

function SymptomRow({
  symptom,
  isUpdating,
  onPresenceChange,
}: SymptomRowProps) {
  return (
    <Box sx={{ py: 1.5, opacity: isUpdating ? 0.6 : 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" fontWeight={700}>
            {symptom.criterioNombre}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {symptom.criterioCodigo}
            {symptom.categoriaCriterio ? ` · ${symptom.categoriaCriterio}` : ""}
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              checked={Boolean(symptom.presente)}
              onChange={(event) =>
                onPresenceChange(symptom, event.target.checked)
              }
              disabled={isUpdating}
              size="small"
            />
          }
          label="Presente"
          sx={{ mr: 0, whiteSpace: "nowrap" }}
        />
      </Box>
    </Box>
  );
}
