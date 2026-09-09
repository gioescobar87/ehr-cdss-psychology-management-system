import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";

import { usePatientSymptoms } from "../hooks/useSessionSymptoms";
import type { Sesion } from "../types/session.types";

interface SessionSymptomsReadOnlyDialogProps {
  open: boolean;
  session: Sesion;
  onClose: () => void;
}

export default function SessionSymptomsReadOnlyDialog({
  open,
  session,
  onClose,
}: SessionSymptomsReadOnlyDialogProps) {
  const {
    data: allSymptoms = [],
    isLoading,
    isError,
  } = usePatientSymptoms(session.pacienteId);

  const visibleSymptoms = allSymptoms.filter((symptom) => symptom.presente);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <HealingOutlinedIcon color="secondary" />
          <Typography variant="h6" fontWeight={700}>
            Sintomatología
          </Typography>
        </Stack>

        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {isError ? (
          <Alert severity="error">
            No fue posible cargar la sintomatología del paciente.
          </Alert>
        ) : isLoading ? (
          <Box
            sx={{
              minHeight: 180,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : visibleSymptoms.length === 0 ? (
          <Box
            sx={{
              py: 4,
              textAlign: "center",
            }}
          >
            <HealingOutlinedIcon
              sx={{
                fontSize: 44,
                color: "text.disabled",
              }}
            />

            <Typography variant="body1" fontWeight={600} sx={{ mt: 1 }}>
              No hay síntomas presentes
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              No se han registrado síntomas presentes para este paciente.
            </Typography>
          </Box>
        ) : (
          <Stack divider={<Divider flexItem />} spacing={0}>
            {visibleSymptoms.map((symptom) => (
              <Box
                key={symptom.id}
                sx={{
                  py: 1.75,
                }}
              >
                <Stack spacing={0.75}>
                  <Typography variant="body1" fontWeight={700}>
                    {symptom.criterioNombre}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    flexWrap="wrap"
                    useFlexGap
                  >
                    <Chip
                      label={symptom.criterioCodigo}
                      size="small"
                      variant="outlined"
                    />

                    {symptom.categoriaCriterio && (
                      <Typography variant="body2" color="text.secondary">
                        {symptom.categoriaCriterio}
                      </Typography>
                    )}
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
