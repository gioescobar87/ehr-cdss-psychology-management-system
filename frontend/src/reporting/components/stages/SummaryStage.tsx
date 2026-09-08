import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
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
    if (key === sortKey) setAscending((value) => !value);
    else {
      setSortKey(key);
      setAscending(key !== "cancellationRate");
    }
  };
  const heading = (label: string, key: SummaryKey) => (
    <Button
      variant="text"
      size="small"
      onClick={() => sort(key)}
      sx={{ minWidth: 0, p: 0, color: "inherit", fontWeight: 700 }}
    >
      {label} {sortKey === key ? (ascending ? "↑" : "↓") : "↕"}
    </Button>
  );

  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>{heading("Psicólogo", "psychologistName")}</TableCell>
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
              {heading("Tasa cancelación", "cancellationRate")}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedRows.map((row) => (
            <TableRow key={row.psychologistId} hover>
              <TableCell sx={{ fontWeight: 600 }}>
                {row.psychologistName}
              </TableCell>
              <TableCell align="right">{row.patientCount}</TableCell>
              <TableCell align="right">{row.appointmentCount}</TableCell>
              <TableCell align="right">{row.attendedCount}</TableCell>
              <TableCell align="right">{row.cancelledCount}</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                {row.cancellationRate.toFixed(1)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
