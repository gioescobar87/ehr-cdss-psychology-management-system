import { Box, Chip, IconButton, Stack, Typography } from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PersonIcon from "@mui/icons-material/Person";
//import AccessTimeIcon from "@mui/icons-material/AccessTime";
//import EventIcon from "@mui/icons-material/Event";

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
          py: {
            xs: 1.25,
            sm: 1.5,
          },
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{
            mb: 1,
          }}
        >
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
          spacing={{
            xs: 1.25,
            sm: 2,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            alignItems={{
              xs: "flex-start",
              sm: "center",
            }}
            spacing={{
              xs: 0.5,
              sm: 1.5,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <PersonIcon
                color="action"
                sx={{
                  fontSize: 24,
                }}
              />

              {onPatientClick ? (
                <Typography
                  component="button"
                  onClick={() => onPatientClick(session.pacienteId)}
                  variant="h6"
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
                <Typography variant="h6" fontWeight={700}>
                  {session.pacienteNombre}
                </Typography>
              )}
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                display: {
                  xs: "block",
                  sm: "inline",
                },
              }}
            >
              · Sesión clínica · {formatAppointmentDate(session.fechaSesion)} ·{" "}
              {formatAppointmentTime(session.fechaSesion)}
            </Typography>
          </Stack>

          <Chip
            label="Sesión en curso"
            color="success"
            variant="outlined"
            size="small"
            sx={{
              fontWeight: 700,
              borderRadius: 2,
            }}
          />
        </Stack>
      </Box>
    </Box>
  );
}
