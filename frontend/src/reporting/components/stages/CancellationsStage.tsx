import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";

import type { CoordinatorCancellation } from "../../types/coordinatorReport.types";

type CancellationKey =
  | "patientName"
  | "appointmentDate"
  | "cancellationDate"
  | "cancelledByUserName"
  | "reason";

export default function CancellationsStage({
  cancellations,
  onPatientSelect,
}: {
  cancellations: CoordinatorCancellation[];
  onPatientSelect: (patientId: number) => void;
}) {
  const [sortKey, setSortKey] =
    useState<CancellationKey>("cancellationDate");

  const [ascending, setAscending] = useState(false);

  const sortedCancellations = useMemo(
    () =>
      [...cancellations].sort((left, right) => {
        const a = left[sortKey];
        const b = right[sortKey];

        const aValue = a ?? "";
        const bValue = b ?? "";

        const result =
          typeof aValue === "string" && typeof bValue === "string"
            ? aValue.localeCompare(bValue, "es", {
                numeric: true,
                sensitivity: "base",
              })
            : Number(aValue) - Number(bValue);

        return ascending ? result : -result;
      }),
    [ascending, cancellations, sortKey],
  );

  const sort = (key: CancellationKey) => {
    if (key === sortKey) {
      setAscending((value) => !value);
    } else {
      setSortKey(key);

      // Dates default to descending because the newest
      // records are generally the most useful in a history.
      setAscending(key !== "cancellationDate");
    }
  };

  const getSortIcon = (key: CancellationKey) => {
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

  const heading = (
    label: string,
    key: CancellationKey,
  ) => (
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
        {cancellations.length === 1 ? "registro" : "registros"}{" "}
        mostrados
      </Typography>

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
                {heading("Fecha cita", "appointmentDate")}
              </TableCell>

              <TableCell sx={{ minWidth: 180 }}>
                {heading(
                  "Fecha de cancelación",
                  "cancellationDate",
                )}
              </TableCell>

              <TableCell sx={{ minWidth: 150 }}>
                {heading("Usuario", "cancelledByUserName")}
              </TableCell>

              <TableCell sx={{ minWidth: 250 }}>
                {heading("Motivo", "reason")}
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {sortedCancellations.map((cancellation) => (
              <TableRow
                key={cancellation.id}
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
                <TableCell>
                  <Button
                    variant="text"
                    onClick={() =>
                      onPatientSelect(cancellation.patientId)
                    }
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {formatDate(cancellation.appointmentDate)}
                  </Typography>
                </TableCell>

                <TableCell>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
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
                    {formatUserName(
                      cancellation.cancelledByUserName,
                    )}
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
                    {cancellation.reason ||
                      "Sin motivo registrado"}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}

            {sortedCancellations.length === 0 && (
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

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      No hay cancelaciones para los filtros
                      seleccionados.
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
