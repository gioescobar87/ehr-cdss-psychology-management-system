import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import MedicalInformationOutlinedIcon from "@mui/icons-material/MedicalInformationOutlined";
import type { ReactNode } from "react";

import { useMedicalHistory } from "../hooks/useMedicalHistory";
import type {
  AllergyHistoryItem,
  FamilyHistoryItem,
  MedicalHistoryItem,
  MedicationHistoryItem,
} from "../types/medicalHistory.types";

interface MedicalHistoryDialogProps {
  open: boolean;
  patientId: number;
  onClose: () => void;
}

export default function MedicalHistoryDialog({
  open,
  patientId,
  onClose,
}: MedicalHistoryDialogProps) {
  const { medical, family, allergies, medications } = useMedicalHistory(
    patientId,
    open,
  );
  const queries = [medical, family, allergies, medications];
  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.isError);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <MedicalInformationOutlinedIcon color="primary" />
        Historial médico
      </DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Box
            sx={{
              minHeight: 360,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <Stack spacing={3}>
            {hasError && (
              <Alert severity="error">
                No fue posible cargar uno o más bloques del historial médico.
              </Alert>
            )}
            <HistorySection title="Antecedentes médicos personales">
              <MedicalHistoryTable items={medical.data ?? []} />
            </HistorySection>
            <HistorySection title="Antecedentes familiares">
              <FamilyHistoryTable items={family.data ?? []} />
            </HistorySection>
            <HistorySection title="Alergias">
              <AllergyHistoryTable items={allergies.data ?? []} />
            </HistorySection>
            <HistorySection title="Medicación">
              <MedicationHistoryTable items={medications.data ?? []} />
            </HistorySection>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function HistorySection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        {title}
      </Typography>
      <Divider sx={{ mb: 1.5 }} />
      {children}
    </Box>
  );
}

function EmptyHistory({ message = "Sin registros" }: { message?: string }) {
  return (
    <Typography variant="body2" color="text.secondary" sx={{ py: 1 }}>
      {message}
    </Typography>
  );
}

function MedicalHistoryTable({ items }: { items: MedicalHistoryItem[] }) {
  if (!items.length) return <EmptyHistory />;
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Fecha</TableCell>
            <TableCell>Condición médica</TableCell>
            <TableCell>Tratamiento actual</TableCell>
            <TableCell>Observaciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.fechaDiagnostico}</TableCell>
              <TableCell>{item.condicionMedica}</TableCell>
              <TableCell>{item.tratamientoActual || "-"}</TableCell>
              <TableCell>{item.observaciones || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function FamilyHistoryTable({ items }: { items: FamilyHistoryItem[] }) {
  if (!items.length) return <EmptyHistory />;
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Condición médica</TableCell>
            <TableCell>Parentesco</TableCell>
            <TableCell>Observaciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.condicionMedica}</TableCell>
              <TableCell>{item.parentesco}</TableCell>
              <TableCell>{item.observaciones || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function AllergyHistoryTable({ items }: { items: AllergyHistoryItem[] }) {
  if (!items.length) return <EmptyHistory />;
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Sustancia alergénica</TableCell>
            <TableCell>Reacción</TableCell>
            <TableCell>Severidad</TableCell>
            <TableCell>Observaciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.sustanciaAlergena || "-"}</TableCell>
              <TableCell>{item.tipoReaccion || "-"}</TableCell>
              <TableCell>{item.nivelSeveridadAlergia || "-"}</TableCell>
              <TableCell>{item.observaciones || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function MedicationHistoryTable({ items }: { items: MedicationHistoryItem[] }) {
  if (!items.length) return <EmptyHistory />;
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Medicamento</TableCell>
            <TableCell>Dosis</TableCell>
            <TableCell>Frecuencia</TableCell>
            <TableCell>Vía</TableCell>
            <TableCell>Inicio</TableCell>
            <TableCell>Fin</TableCell>
            <TableCell>Prescrito por</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.medicamento}</TableCell>
              <TableCell>{item.dosis || "-"}</TableCell>
              <TableCell>{item.frecuencia || "-"}</TableCell>
              <TableCell>{item.viaAdministracion || "-"}</TableCell>
              <TableCell>{item.fechaInicio || "-"}</TableCell>
              <TableCell>{item.fechaFin || "-"}</TableCell>
              <TableCell>{item.prescritoPor || "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
