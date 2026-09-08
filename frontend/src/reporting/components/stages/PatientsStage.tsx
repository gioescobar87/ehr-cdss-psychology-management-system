import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import type { CoordinatorPatient } from "../../types/coordinatorReport.types";

function formatDate(value?: string | null) {
  return value
    ? new Intl.DateTimeFormat("es-GT", { dateStyle: "medium" }).format(
        new Date(value),
      )
    : "—";
}

export default function PatientsStage({
  patients,
  onSelect,
}: {
  patients: CoordinatorPatient[];
  onSelect: (patientId: number) => void;
}) {
  return (
    <Box sx={{ overflowX: "auto" }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            {[
              "Paciente",
              "Psicólogo",
              "Estado",
              "Fecha inicio",
              "Motivo inicio",
              "Fecha cierre",
              "Motivo cierre",
            ].map((heading) => (
              <TableCell key={heading}>{heading}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.patientId} hover>
              <TableCell>
                <Button
                  variant="text"
                  onClick={() => onSelect(patient.patientId)}
                  sx={{ textTransform: "none", p: 0, minWidth: 0 }}
                >
                  {patient.patientName}
                </Button>
              </TableCell>
              <TableCell>{patient.psychologistName}</TableCell>
              <TableCell>{patient.status}</TableCell>
              <TableCell>{formatDate(patient.fechaInicio)}</TableCell>
              <TableCell>{patient.motivoInicio || "—"}</TableCell>
              <TableCell>
                {patient.fechaCierre
                  ? formatDate(patient.fechaCierre)
                  : "No aplica"}
              </TableCell>
              <TableCell>
                {patient.fechaCierre
                  ? patient.motivoCierre || "—"
                  : "No aplica"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Box>
  );
}
