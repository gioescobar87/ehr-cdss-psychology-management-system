import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import type { CoordinatorCancellation } from "../../types/coordinatorReport.types";

function getPatientInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.charAt(0))
    .join(". ")
    .toUpperCase()
    .concat(".");
}

function formatUserName(name: string | null | undefined) {
  if (!name) {
    return "No registrado";
  }

  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "No registrado";
  }

  if (parts.length === 1) {
    return parts[0];
  }

  return `${parts[0]} ${parts[parts.length - 2]}`;
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-GT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function CancellationsStage({
  cancellations,
  onPatientSelect,
}: {
  cancellations: CoordinatorCancellation[];
  onPatientSelect: (patientId: number) => void;
}) {
  return (
    <Box>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          mb: 1.5,
          fontWeight: 500,
        }}
      >
        {cancellations.length}{" "}
        {cancellations.length === 1 ? "registro" : "registros"} mostrados
      </Typography>

      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Table
          sx={{
            minWidth: 900,
            "& .MuiTableCell-root": {
              borderColor: "divider",
            },
          }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "grey.50",
              }}
            >
              <TableCell sx={{ fontWeight: 700 }}>
                Paciente
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Fecha cita
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Fecha de cancelación
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Usuario
              </TableCell>

              <TableCell sx={{ fontWeight: 700 }}>
                Motivo
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cancellations.map((cancellation) => (
              <TableRow
                key={cancellation.id}
                hover
                sx={{
                  "&:last-child td": {
                    borderBottom: 0,
                  },
                }}
              >
                <TableCell>
                  <Button
                    variant="text"
                    onClick={() => onPatientSelect(cancellation.patientId)}
                    startIcon={
                      <PersonOutlineRoundedIcon fontSize="small" />
                    }
                    sx={{
                      textTransform: "none",
                      p: 0,
                      minWidth: 0,
                      fontWeight: 700,
                      justifyContent: "flex-start",
                      color: "text.primary",
                      "&:hover": {
                        backgroundColor: "transparent",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    {getPatientInitials(cancellation.patientName)}
                  </Button>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {formatDate(cancellation.appointmentDate)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography variant="body2">
                    {formatDate(cancellation.cancellationDate)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color={
                      cancellation.cancelledByUserName
                        ? "text.primary"
                        : "text.secondary"
                    }
                    fontWeight={
                      cancellation.cancelledByUserName ? 500 : 400
                    }
                  >
                    {formatUserName(cancellation.cancelledByUserName)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color={
                      cancellation.reason
                        ? "text.primary"
                        : "text.secondary"
                    }
                    sx={{
                      maxWidth: 320,
                      lineHeight: 1.5,
                    }}
                  >
                    {cancellation.reason || "Sin motivo registrado"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            {cancellations.length === 0 && (
              <TableRow>
                <TableCell colSpan={5}>
                  <Box
                    sx={{
                      py: 6,
                      px: 2,
                      textAlign: "center",
                    }}
                  >
                    <Typography
                      variant="body1"
                      fontWeight={600}
                      sx={{ mb: 0.5 }}
                    >
                      No hay cancelaciones
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      No hay cancelaciones para los filtros seleccionados.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
