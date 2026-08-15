import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";

import type { Sesion } from "../types/session.types";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "../../shared/utils/dateUtils";

interface SessionHeaderProps {
  session: Sesion;
  onBack: () => void;
  onPatientClick?: (patientId: number) => void;
}

export default function SessionHeader({
  session,
  onBack,
  onPatientClick,
}: SessionHeaderProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          px: {
            xs: 2,
            md: 3,
          },
          pt: 1.5,
          pb: 2.5,
        }}
      >
        {/* Back navigation */}

        <Box sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={0.5}>
            <IconButton
              size="small"
              onClick={onBack}
              aria-label="Volver a la agenda"
            >
              <ArrowBackIcon fontSize="small" />
            </IconButton>

            <Typography
              component="button"
              variant="body2"
              onClick={onBack}
              sx={{
                border: 0,
                background: "none",
                cursor: "pointer",
                color: "text.secondary",
                fontWeight: 600,
                p: 0,

                "&:hover": {
                  color: "primary.main",
                },
              }}
            >
              Agenda
            </Typography>
          </Stack>
        </Box>

        {/* Patient identity */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={2}
        >
          <Box>
            <Stack direction="row" spacing={1.25} alignItems="center">
              <PersonIcon
                color="action"
                sx={{
                  fontSize: 28,
                }}
              />

              {onPatientClick ? (
                <Typography
                  component="button"
                  onClick={() => onPatientClick(session.pacienteId)}
                  variant="h5"
                  fontWeight={700}
                  sx={{
                    border: 0,
                    background: "none",
                    cursor: "pointer",
                    color: "text.primary",
                    p: 0,
                    textAlign: "left",

                    "&:hover": {
                      color: "primary.main",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {session.pacienteNombre}
                </Typography>
              ) : (
                <Typography variant="h5" fontWeight={700}>
                  {session.pacienteNombre}
                </Typography>
              )}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.5,
                ml: {
                  xs: 0,
                  sm: 5.25,
                },
              }}
            >
              Paciente activo
            </Typography>
          </Box>

          {/* Session status */}

          <Chip
            label="Sesión en curso"
            color="success"
            variant="outlined"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
            }}
          />
        </Stack>

        {/* Session metadata */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          spacing={{
            xs: 1,
            sm: 3,
          }}
          sx={{
            mt: 2.5,
            color: "text.secondary",
          }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <EventIcon fontSize="small" />

            <Typography variant="body2">
              {formatAppointmentDate(session.fechaSesion)}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">
            <AccessTimeIcon fontSize="small" />

            <Typography variant="body2">
              {formatAppointmentTime(session.fechaSesion)}
            </Typography>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
}
