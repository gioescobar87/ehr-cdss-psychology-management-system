import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventIcon from "@mui/icons-material/Event";
import PersonIcon from "@mui/icons-material/Person";

import {
  Box,
  Chip,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import type { Sesion } from "../types/session.types";

interface SessionHeaderProps {
  session: Sesion;
  onBack: () => void;
}

export default function SessionHeader({ session, onBack }: SessionHeaderProps) {
  const date = new Intl.DateTimeFormat("es-GT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(session.fechaSesion));

  const time = new Intl.DateTimeFormat("es-GT", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(session.fechaSesion));

  return (
    <Box>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
        <IconButton onClick={onBack} aria-label="Regresar">
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          Sesión clínica
        </Typography>
      </Stack>

      <Box
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <Stack
          direction={{
            xs: "column",
            md: "row",
          }}
          spacing={2}
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PersonIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Paciente
              </Typography>
              <Typography variant="h6" fontWeight={700}>
                {session.pacienteNombre}
              </Typography>
            </Box>
          </Stack>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <EventIcon color="action" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Fecha y hora
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {date} . {time}
              </Typography>
            </Box>
          </Stack>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Estado
            </Typography>
            <Chip label={session.estado} size="small" />
          </Box>
        </Stack>
      </Box>
      <Divider sx={{ mt: 3 }} />
    </Box>
  );
}
