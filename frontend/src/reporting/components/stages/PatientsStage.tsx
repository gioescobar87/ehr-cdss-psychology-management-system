import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import type { CoordinatorPatient } from "../../types/coordinatorReport.types";

type PatientStatusFilter = "all" | "active" | "inactive";

type AnnotationDialogState = {
  startReason?: string | null;
  closingReason?: string | null;
} | null;

type PatientSortKey =
  | "patientName"
  | "psychologistName"
  | "referralSource"
  | "startDate"
  | "closingDate"
  | "status";

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

function formatAge(age?: number | null) {
  if (age === null || age === undefined) {
    return "";
  }

  return ` (${age} ${age === 1 ? "año" : "años"})`;
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

function isInSelectedMonth(patient: CoordinatorPatient, selectedMonth: string) {
  if (!selectedMonth) {
    return true;
  }

  const monthStart = `${selectedMonth}-01`;

  const [year, month] = selectedMonth.split("-").map(Number);

  const nextMonthStart = new Date(Date.UTC(year, month, 1))
    .toISOString()
    .slice(0, 10);

  const startDate = patient.startDate?.slice(0, 10);
  const closeDate = patient.closingDate?.slice(0, 10);

  return (
    (!startDate || startDate < nextMonthStart) &&
    (!closeDate || closeDate >= monthStart)
  );
}

function hasReason(value?: string | null) {
  return Boolean(value?.trim());
}

function getStatusAppearance(status?: string | null) {
  const normalized = normalizeStatus(status);

  if (normalized === "activo") {
    return {
      label: "Activo",
      color: "success" as const,
    };
  }

  if (normalized === "inactivo") {
    return {
      label: "Inactivo",
      color: "default" as const,
    };
  }

  return {
    label: status || "Sin estado",
    color: "default" as const,
  };
}

function getSortValue(
  patient: CoordinatorPatient,
  sortKey: PatientSortKey,
): string {
  switch (sortKey) {
    case "patientName":
      return patient.patientName?.trim() ?? "";

    case "psychologistName":
      return patient.psychologistName?.trim() ?? "";

    case "referralSource":
      return patient.referralSource?.trim() ?? "";

    case "startDate":
      return patient.startDate ?? "";

    case "closingDate":
      return patient.closingDate ?? "";

    case "status":
      return patient.status?.trim() ?? "";
  }
}

export default function PatientsStage({
  patients,
  reportMonth,
  onSelect,
  onSelectLastSession,
}: {
  patients: CoordinatorPatient[];
  reportMonth: string;
  onSelect: (patientId: number) => void;
  onSelectLastSession: (sessionId: number) => void;
}) {
  const [statusFilter, setStatusFilter] =
    useState<PatientStatusFilter>("all");

  const [sortKey, setSortKey] =
    useState<PatientSortKey>("patientName");

  const [ascending, setAscending] = useState(true);

  const [annotationDialog, setAnnotationDialog] =
    useState<AnnotationDialogState>(null);

  const filteredPatients = patients.filter(
    (patient) =>
      isInSelectedMonth(patient, reportMonth) &&
      matchesStatus(patient, statusFilter),
  );

  const sortedPatients = useMemo(
    () =>
      [...filteredPatients].sort((left, right) => {
        const a = getSortValue(left, sortKey);
        const b = getSortValue(right, sortKey);

        const result = a.localeCompare(b, "es", {
          numeric: true,
          sensitivity: "base",
        });

        return ascending ? result : -result;
      }),
    [ascending, filteredPatients, sortKey],
  );

  const handleStatusChange = (
    _: React.MouseEvent<HTMLElement>,
    value: PatientStatusFilter | null,
  ) => {
    if (value !== null) {
      setStatusFilter(value);
    }
  };

  const sort = (key: PatientSortKey) => {
    if (key === sortKey) {
      setAscending((value) => !value);
    } else {
      setSortKey(key);
      setAscending(true);
    }
  };

  const getSortIcon = (key: PatientSortKey) => {
    if (sortKey !== key) {
      return (
        <UnfoldMoreRoundedIcon
          sx={{
            fontSize: 17,
            color: "text.disabled",
          }}
        />
      );
    }

    return ascending ? (
      <ArrowUpwardRoundedIcon
        sx={{
          fontSize: 17,
          color: "primary.main",
        }}
      />
    ) : (
      <ArrowDownwardRoundedIcon
        sx={{
          fontSize: 17,
          color: "primary.main",
        }}
      />
    );
  };

  const heading = (label: string, key: PatientSortKey) => (
    <Box
      component="button"
      type="button"
      onClick={() => sort(key)}
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: 0.5,
        border: 0,
        background: "transparent",
        color: "inherit",
        cursor: "pointer",
        p: 0,
        font: "inherit",
        fontWeight: 700,
        textAlign: "left",
        "&:hover": {
          color: "primary.main",
        },
      }}
    >
      <Typography
        component="span"
        variant="caption"
        fontWeight={700}
        sx={{
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </Typography>

      {getSortIcon(key)}
    </Box>
  );

  const handleOpenAnnotations = (patient: CoordinatorPatient) => {
    setAnnotationDialog({
      startReason: patient.startReason,
      closingReason: patient.closingReason,
    });
  };

  const handleCloseAnnotations = () => {
    setAnnotationDialog(null);
  };

  const hasAnnotations =
    hasReason(annotationDialog?.startReason) ||
    hasReason(annotationDialog?.closingReason);

  return (
    <Box>
      {/* Filters */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 2,
        }}
      >
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          {filteredPatients.length}{" "}
          {filteredPatients.length === 1 ? "paciente" : "pacientes"}
        </Typography>

        <ToggleButtonGroup
          value={statusFilter}
          exclusive
          onChange={handleStatusChange}
          size="small"
          aria-label="Filtrar pacientes por estado"
          sx={{
            "& .MuiToggleButton-root": {
              px: 1.75,
              py: 0.75,
              textTransform: "none",
              fontWeight: 600,
              borderColor: "divider",
            },
          }}
        >
          <ToggleButton value="all" aria-label="Todos los pacientes">
            Todos
          </ToggleButton>

          <ToggleButton value="active" aria-label="Pacientes activos">
            Activos
          </ToggleButton>

          <ToggleButton value="inactive" aria-label="Pacientes inactivos">
            Inactivos
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Table */}

      <TableContainer
        sx={{
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflowX: "auto",
          overflowY: "hidden",
          backgroundColor: "background.paper",
        }}
      >
        <Table
          size="small"
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
                backgroundColor: "action.hover",
                "& .MuiTableCell-root": {
                  py: 1.5,
                },
              }}
            >
              <TableCell sx={{ minWidth: 125 }}>
                {heading("Paciente", "patientName")}
              </TableCell>

              <TableCell sx={{ minWidth: 150 }}>
                {heading("Psicólogo", "psychologistName")}
              </TableCell>

              <TableCell sx={{ minWidth: 110 }}>
                {heading("Refiere", "referralSource")}
              </TableCell>

              <TableCell sx={{ minWidth: 110 }}>
                {heading("Fecha inicio", "startDate")}
              </TableCell>

              <TableCell sx={{ minWidth: 110 }}>
                {heading("Fecha cierre", "closingDate")}
              </TableCell>

              <TableCell sx={{ minWidth: 150 }}>
                <TableHeading>Acciones</TableHeading>
              </TableCell>

              <TableCell sx={{ minWidth: 150 }}>
                <TableHeading>Diagnósticos</TableHeading>
              </TableCell>

              <TableCell sx={{ minWidth: 110 }}>
                {heading("Estado", "status")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedPatients.map((patient) => {
              const statusAppearance = getStatusAppearance(patient.status);

              const hasPatientAnnotations =
                hasReason(patient.startReason) ||
                hasReason(patient.closingReason);

              const hasLastSession = patient.ultimaSesionId != null;

              return (
                <TableRow
                  key={patient.patientId}
                  hover
                  sx={{
                    "&:last-child .MuiTableCell-root": {
                      borderBottom: 0,
                    },
                    "& .MuiTableCell-root": {
                      py: 1.75,
                    },
                  }}
                >
                  {/* Patient */}

                  <TableCell>
                    <Button
                      variant="text"
                      onClick={() => onSelect(patient.patientId)}
                      startIcon={<PersonOutlineRoundedIcon fontSize="small" />}
                      sx={{
                        textTransform: "none",
                        p: 0,
                        minWidth: 0,
                        fontWeight: 700,
                        justifyContent: "flex-start",
                        "&:hover": {
                          backgroundColor: "transparent",
                          textDecoration: "underline",
                        },
                      }}
                    >
                      {formatInitials(patient.patientName)}
                      {formatAge(patient.age)}
                    </Button>
                  </TableCell>

                  {/* Psychologist */}

                  <TableCell>
                    <Typography variant="body2" fontWeight={600} noWrap>
                      {formatPsychologistName(patient.psychologistName)}
                    </Typography>
                  </TableCell>

                  {/* Referral */}

                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {patient.referralSource?.trim() || "—"}
                    </Typography>
                  </TableCell>

                  {/* Start date */}

                  <TableCell>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(patient.startDate)}
                    </Typography>
                  </TableCell>

                  {/* Closing date */}

                  <TableCell>
                    <Typography
                      variant="body2"
                      color={
                        patient.closingDate
                          ? "text.secondary"
                          : "text.disabled"
                      }
                      sx={{
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {formatDate(patient.closingDate)}
                    </Typography>
                  </TableCell>

                  {/* Actions */}

                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        gap: 0.5,
                      }}
                    >
                      {hasPatientAnnotations ? (
                        <Button
                          variant="text"
                          size="small"
                          color="secondary"
                          startIcon={
                            <VisibilityOutlinedIcon fontSize="small" />
                          }
                          onClick={() => handleOpenAnnotations(patient)}
                          sx={{
                            textTransform: "none",
                            minWidth: 0,
                            px: 0,
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Anotaciones
                        </Button>
                      ) : null}

                      {hasLastSession ? (
                        <Button
                          variant="text"
                          size="small"
                          color="primary"
                          startIcon={
                            <VisibilityOutlinedIcon fontSize="small" />
                          }
                          onClick={() =>
                            onSelectLastSession(patient.ultimaSesionId!)
                          }
                          sx={{
                            textTransform: "none",
                            minWidth: 0,
                            px: 0,
                            fontWeight: 600,
                            "&:hover": {
                              backgroundColor: "transparent",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          Última sesión
                        </Button>
                      ) : null}
                    </Box>
                  </TableCell>

                  {/* Diagnoses */}

                  <TableCell>
                    {patient.diagnoses.length > 0 ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 0.5,
                        }}
                      >
                        {patient.diagnoses.map((diagnosis) => (
                          <Typography
                            key={diagnosis.diagnosisId}
                            variant="body2"
                          >
                            {diagnosis.code ? `${diagnosis.code} · ` : ""}
                            {diagnosis.name}
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>

                  {/* Status */}

                  <TableCell>
                    <Chip
                      label={statusAppearance.label}
                      color={statusAppearance.color}
                      variant="outlined"
                      size="small"
                      sx={{
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            })}

            {sortedPatients.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  align="center"
                  sx={{
                    py: 6,
                  }}
                >
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={500}
                  >
                    No hay pacientes para el filtro seleccionado.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Annotations dialog */}

      <Dialog
        open={annotationDialog !== null}
        onClose={handleCloseAnnotations}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
          }}
        >
          Anotaciones del paciente
        </DialogTitle>

        <DialogContent dividers>
          {!hasAnnotations ? (
            <Typography variant="body2" color="text.secondary">
              No hay anotaciones registradas.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 3,
              }}
            >
              {hasReason(annotationDialog?.startReason) && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.secondary"
                    sx={{
                      mb: 1,
                    }}
                  >
                    Motivo consulta
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      lineHeight: 1.7,
                    }}
                  >
                    {annotationDialog?.startReason}
                  </Typography>
                </Box>
              )}

              {hasReason(annotationDialog?.closingReason) && (
                <Box>
                  <Typography
                    variant="subtitle2"
                    fontWeight={700}
                    color="text.secondary"
                    sx={{
                      mb: 1,
                    }}
                  >
                    Motivo de cierre
                  </Typography>

                  <Typography
                    variant="body1"
                    sx={{
                      whiteSpace: "pre-wrap",
                      overflowWrap: "anywhere",
                      lineHeight: 1.7,
                    }}
                  >
                    {annotationDialog?.closingReason}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleCloseAnnotations}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <Typography
      variant="caption"
      fontWeight={700}
      color="text.secondary"
      sx={{
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {children}
    </Typography>
  );
}
