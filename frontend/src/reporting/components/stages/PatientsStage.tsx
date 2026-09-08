import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { useState } from "react";
import type { CoordinatorPatient } from "../../types/coordinatorReport.types";

type PatientStatusFilter =
  | "all"
  | "active"
  | "inactive";

type ReasonDialogState = {
  title: string;
  content: string;
} | null;

function formatDate(value?: string | null) {
  return value
    ? new Intl.DateTimeFormat("es-GT", {
        dateStyle: "medium",
      }).format(new Date(value))
    : "—";
}

function formatInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0])
    .join(".")
    .toUpperCase()
    .concat(".");
}

function formatPsychologistName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length <= 2) {
    return parts.join(" ");
  }

  return `${parts[0]} ${parts[2]}`;
}

function normalizeStatus(value?: string | null) {
  return value
    ?.trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function matchesStatus(
  patient: CoordinatorPatient,
  filter: PatientStatusFilter,
) {
  if (filter === "all") {
    return true;
  }

  const status = normalizeStatus(patient.status);

  if (filter === "active") {
    return status === "activo";
  }

  return status === "inactivo";
}

function isInSelectedMonth(
  patient: CoordinatorPatient,
  selectedMonth: string,
) {
  if (!selectedMonth) {
    return true;
  }

  const monthStart = `${selectedMonth}-01`;

  const [year, month] = selectedMonth.split("-").map(Number);

  const nextMonthStart = new Date(
    Date.UTC(year, month, 1),
  )
    .toISOString()
    .slice(0, 10);

  const startDate = patient.fechaInicio?.slice(0, 10);
  const closeDate = patient.fechaCierre?.slice(0, 10);

  return (
    (!startDate || startDate < nextMonthStart) &&
    (!closeDate || closeDate >= monthStart)
  );
}

function hasReason(value?: string | null) {
  return Boolean(value?.trim());
}

export default function PatientsStage({
  patients,
  reportMonth,
  onSelect,
}: {
  patients: CoordinatorPatient[];
  reportMonth: string;
  onSelect: (patientId: number) => void;
}) {
  const [statusFilter, setStatusFilter] =
    useState<PatientStatusFilter>("all");

  const [reasonDialog, setReasonDialog] =
    useState<ReasonDialogState>(null);

  const filteredPatients = patients.filter(
    (patient) =>
      isInSelectedMonth(patient, reportMonth) &&
      matchesStatus(patient, statusFilter),
  );

  const handleStatusChange = (
    _: React.MouseEvent<HTMLElement>,
    value: PatientStatusFilter | null,
  ) => {
    if (value !== null) {
      setStatusFilter(value);
    }
  };

  const handleOpenReason = (
    title: string,
    content: string,
  ) => {
    setReasonDialog({
      title,
      content,
    });
  };

  const handleCloseReason = () => {
    setReasonDialog(null);
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: {
            xs: "stretch",
            sm: "flex-end",
          },
          mb: 2,
        }}
      >
        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleStatusChange}
          size="small"
          aria-label="Filtrar pacientes por estado"
        >
          <ToggleButton
            value="all"
            aria-label="Todos los pacientes"
          >
            Todos
          </ToggleButton>

          <ToggleButton
            value="active"
            aria-label="Pacientes activos"
          >
            Activos
          </ToggleButton>

          <ToggleButton
            value="inactive"
            aria-label="Pacientes inactivos"
          >
            Inactivos
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {[
                "Paciente",
                "Psicólogo",
                "Fecha inicio",
                "Motivo consulta",
                "Fecha cierre",
                "Motivo cierre",
              ].map((heading) => (
                <TableCell key={heading}>
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredPatients.map((patient) => (
              <TableRow
                key={patient.patientId}
                hover
              >
                <TableCell>
                  <Button
                    variant="text"
                    onClick={() =>
                      onSelect(patient.patientId)
                    }
                    sx={{
                      textTransform: "none",
                      p: 0,
                      minWidth: 0,
                    }}
                  >
                    {formatInitials(
                      patient.patientName,
                    )}
                  </Button>
                </TableCell>

                <TableCell>
                  {formatPsychologistName(
                    patient.psychologistName,
                  )}
                </TableCell>

                <TableCell>
                  {formatDate(
                    patient.fechaInicio,
                  )}
                </TableCell>

                <TableCell>
                  {hasReason(patient.motivoInicio) ? (
                    <Button
                      variant="text"
                      size="small"
                      startIcon={
                        <VisibilityOutlinedIcon fontSize="small" />
                      }
                      onClick={() =>
                        handleOpenReason(
                          "Motivo de consulta",
                          patient.motivoInicio!,
                        )
                      }
                      sx={{
                        textTransform: "none",
                        minWidth: 0,
                        px: 0,
                      }}
                    >
                      Ver motivo
                    </Button>
                  ) : (
                    "—"
                  )}
                </TableCell>

                <TableCell>
                  {patient.fechaCierre
                    ? formatDate(
                        patient.fechaCierre,
                      )
                    : "---"}
                </TableCell>

                <TableCell>
                  {hasReason(patient.motivoCierre) ? (
                    <Button
                      variant="text"
                      size="small"
                      startIcon={
                        <VisibilityOutlinedIcon fontSize="small" />
                      }
                      onClick={() =>
                        handleOpenReason(
                          "Motivo de cierre",
                          patient.motivoCierre!,
                        )
                      }
                      sx={{
                        textTransform: "none",
                        minWidth: 0,
                        px: 0,
                      }}
                    >
                      Ver motivo
                    </Button>
                  ) : (
                    "---"
                  )}
                </TableCell>
              </TableRow>
            ))}

            {filteredPatients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  align="center"
                  sx={{
                    py: 4,
                    color: "text.secondary",
                  }}
                >
                  No hay pacientes para el filtro seleccionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Box>

      <Dialog
        open={reasonDialog !== null}
        onClose={handleCloseReason}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {reasonDialog?.title}
        </DialogTitle>

        <DialogContent dividers>
          <Typography
            variant="body1"
            sx={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
            }}
          >
            {reasonDialog?.content}
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseReason}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
