import { useMemo, useState } from "react";
import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import PeopleOutlineRoundedIcon from "@mui/icons-material/PeopleOutlineRounded";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";

import type { CoordinatorSummary } from "../../types/coordinatorReport.types";

type SummaryKey = keyof Pick<
  CoordinatorSummary,
  | "psychologistName"
  | "patientCount"
  | "appointmentCount"
  | "attendedCount"
  | "cancelledCount"
  | "cancellationRate"
>;

export default function SummaryStage({ rows }: { rows: CoordinatorSummary[] }) {
  const [sortKey, setSortKey] = useState<SummaryKey>("cancellationRate");
  const [ascending, setAscending] = useState(false);

  const sortedRows = useMemo(
    () =>
      [...rows].sort((left, right) => {
        const a = left[sortKey];
        const b = right[sortKey];

        const result =
          typeof a === "string" && typeof b === "string"
            ? a.localeCompare(b)
            : Number(a) - Number(b);

        return ascending ? result : -result;
      }),
    [ascending, rows, sortKey],
  );

  const sort = (key: SummaryKey) => {
    if (key === sortKey) {
      setAscending((value) => !value);
    } else {
      setSortKey(key);
      setAscending(key !== "cancellationRate");
    }
  };

  const getSortIcon = (key: SummaryKey) => {
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

  const heading = (label: string, key: SummaryKey) => (
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

  const getCancellationAppearance = (rate: number) => {
    if (rate >= 30) {
      return {
        color: "error" as const,
        label: "Alta",
      };
    }

    if (rate >= 15) {
      return {
        color: "warning" as const,
        label: "Media",
      };
    }

    return {
      color: "success" as const,
      label: "Baja",
    };
  };

  return (
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
          minWidth: 760,
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
            <TableCell sx={{ minWidth: 220 }}>
              {heading("Psicólogo", "psychologistName")}
            </TableCell>

            <TableCell align="right">
              {heading("Pacientes", "patientCount")}
            </TableCell>

            <TableCell align="right">
              {heading("Citas", "appointmentCount")}
            </TableCell>

            <TableCell align="right">
              {heading("Atendidas", "attendedCount")}
            </TableCell>

            <TableCell align="right">
              {heading("Canceladas", "cancelledCount")}
            </TableCell>

            <TableCell align="right">
              {heading("Cancelación %", "cancellationRate")}
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortedRows.map((row) => {
            const cancellationAppearance = getCancellationAppearance(
              row.cancellationRate,
            );

            return (
              <TableRow
                key={row.psychologistId}
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
                  <Typography variant="body2" fontWeight={700} noWrap>
                    {row.psychologistName}
                  </Typography>
                </TableCell>

                <TableCell align="right">
                  <MetricCell
                    value={row.patientCount}
                    icon={<PeopleOutlineRoundedIcon />}
                  />
                </TableCell>

                <TableCell align="right">
                  <MetricCell
                    value={row.appointmentCount}
                    icon={<EventOutlinedIcon />}
                  />
                </TableCell>

                <TableCell align="right">
                  <MetricCell
                    value={row.attendedCount}
                    icon={<CheckCircleOutlineRoundedIcon />}
                  />
                </TableCell>

                <TableCell align="right">
                  <MetricCell
                    value={row.cancelledCount}
                    icon={<CancelOutlinedIcon />}
                  />
                </TableCell>

                <TableCell align="right">
                  <Tooltip
                    title={`${cancellationAppearance.label} tasa de cancelación`}
                    arrow
                  >
                    <Chip
                      label={`${row.cancellationRate.toFixed(1)}%`}
                      color={cancellationAppearance.color}
                      variant="outlined"
                      size="small"
                      sx={{
                        minWidth: 72,
                        fontWeight: 700,
                      }}
                    />
                  </Tooltip>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function MetricCell({ value, icon }: { value: number; icon: React.ReactNode }) {
  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "flex-end",
        gap: 0.75,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          color: "text.disabled",
          "& svg": {
            fontSize: 17,
          },
        }}
      >
        {icon}
      </Box>

      <Typography
        variant="body2"
        fontWeight={600}
        sx={{
          minWidth: 28,
          textAlign: "right",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}
