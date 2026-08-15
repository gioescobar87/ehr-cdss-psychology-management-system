import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";

import type { SelectChangeEvent } from "@mui/material";

import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";
import PsychologyIcon from "@mui/icons-material/Psychology";

import type { Appointment } from "../../appointments/types/appointment.types";
import type { SessionType } from "../types/session.types";

interface StartSessionDialogProps {
  open: boolean;
  appointment: Appointment | null;
  sessionTypes: SessionType[];
  selectedSessionTypeId: number | null;
  loading?: boolean;
  loadingSessionTypes?: boolean;
  error?: string | null;
  onClose: () => void;
  onSessionTypeChange: (sessionTypeId: number) => void;
  onConfirm: () => void;
}

export default function StartSessionDialog({
  open,
  appointment,
  sessionTypes,
  selectedSessionTypeId,
  loading = false,
  loadingSessionTypes = false,
  error = null,
  onClose,
  onSessionTypeChange,
  onConfirm,
}: StartSessionDialogProps) {
  if (!appointment) {
    return null;
  }

  const start = new Date(appointment.fechaHoraInicio);

  const formattedDate = new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(start);

  const formattedTime = new Intl.DateTimeFormat("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(start);

  const handleSessionTypeChange = (event: SelectChangeEvent<number>) => {
    onSessionTypeChange(Number(event.target.value));
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle fontWeight={700}>Iniciar sesión clínica</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Typography variant="body2" color="text.secondary">
            Verifica la información de la cita y selecciona el tipo de sesión
            antes de iniciar el registro clínico.
          </Typography>

          <Box
            sx={{
              p: 2,
              borderRadius: 2,
              backgroundColor: "action.hover",
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <PersonIcon color="action" />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Paciente
                  </Typography>

                  <Typography fontWeight={600}>
                    {appointment.pacienteNombre}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <EventIcon color="action" />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Cita
                  </Typography>

                  <Typography fontWeight={600}>
                    {formattedDate} · {formattedTime}
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={1.5} alignItems="center">
                <PsychologyIcon color="action" />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Psicólogo
                  </Typography>

                  <Typography fontWeight={600}>
                    {appointment.usuarioNombre}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <FormControl fullWidth required>
            <InputLabel id="session-type-label">Tipo de sesión</InputLabel>

            <Select
              labelId="session-type-label"
              value={selectedSessionTypeId ?? ""}
              label="Tipo de sesión"
              onChange={handleSessionTypeChange}
              disabled={loading || loadingSessionTypes}
            >
              {loadingSessionTypes ? (
                <MenuItem disabled value="">
                  Cargando tipos de sesión...
                </MenuItem>
              ) : sessionTypes.length === 0 ? (
                <MenuItem disabled value="">
                  No hay tipos de sesión disponibles
                </MenuItem>
              ) : (
                sessionTypes
                  .filter(
                    (sessionType) =>
                      sessionType.estado.toLowerCase() === "activo",
                  )
                  .map((sessionType) => (
                    <MenuItem key={sessionType.id} value={sessionType.id}>
                      {sessionType.nombre}
                    </MenuItem>
                  ))
              )}
            </Select>
          </FormControl>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={onConfirm}
          disabled={
            loading || loadingSessionTypes || selectedSessionTypeId === null
          }
          startIcon={
            loading ? (
              <CircularProgress size={18} color="inherit" />
            ) : (
              <PsychologyIcon />
            )
          }
        >
          {loading ? "Iniciando..." : "Iniciar sesión"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
