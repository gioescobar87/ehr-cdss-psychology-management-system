import {
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import type { ReactNode } from "react";

import { usePatient } from "../hooks/usePatients";
import { useMedicalHistory } from "../../sessions/hooks/useMedicalHistory";
import { formatDateOnly, formatRecordDate } from "../../shared/utils/dateUtils";

interface PatientDetailsDialogProps {
  open: boolean;
  patientId: number | null;
  onClose: () => void;
}

function formatSex(sex: string): string {
  return sex.toUpperCase() === "M"
    ? "Masculino"
    : sex.toUpperCase() === "F"
      ? "Femenino"
      : sex;
}

export default function PatientDetailsDialog({
  open,
  patientId,
  onClose,
}: PatientDetailsDialogProps) {
  const {
    data: patient,
    isLoading: isLoadingPatient,
    isError: isPatientError,
  } = usePatient(patientId, open);

  const history = useMedicalHistory(patientId ?? 0, open && patientId !== null);

  const valorSinRegistro = "---";

  const isLoading =
    isLoadingPatient ||
    history.medical.isLoading ||
    history.family.isLoading ||
    history.allergies.isLoading ||
    history.medications.isLoading ||
    history.emergencyContacts.isLoading;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 3,
          py: 2,
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <PersonOutlinedIcon color="primary" />
          <DialogTitle sx={{ p: 0 }}>
            {patient ? `${patient.nombre} ${patient.apellido}` : "Paciente"}
          </DialogTitle>
        </Stack>

        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider />

      <DialogContent>
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
            <CircularProgress size={28} />
          </Box>
        ) : isPatientError || !patient ? (
          <Alert severity="error">
            No fue posible cargar la información del paciente.
          </Alert>
        ) : (
          <Stack spacing={3} sx={{ py: 1 }}>
            <Section title="Información personal">
              <FieldGrid
                fields={[
                  ["DPI", patient.dpi || valorSinRegistro],
                  [
                    "Fecha de nacimiento",
                    `${formatDateOnly(patient.fechaNacimiento)} (${patient.edad} años)`,
                  ],
                  ["Sexo", formatSex(patient.sexo)],
                  ["Estado civil", patient.estadoCivil || valorSinRegistro],
                  [
                    "Nivel de escolaridad",
                    patient.nivelEscolaridad || valorSinRegistro,
                  ],
                  ["Ocupación", patient.ocupacion || valorSinRegistro],
                  ["Teléfono", patient.telefono || valorSinRegistro],
                  ["Dirección", patient.direccion || valorSinRegistro],
                  ["Refiere", patient.refiere || valorSinRegistro],
                  ["Estado", patient.estado || valorSinRegistro],
                ]}
              />
            </Section>

            <Section title="Antecedentes médicos personales">
              {(history.medical.data ?? []).length === 0 ? (
                <EmptyText />
              ) : (
                <Stack spacing={1.5}>
                  {history.medical.data!.map((item) => (
                    <RecordCard
                      key={item.id}
                      title={item.condicionMedica}
                      lines={[
                        `Fecha de diagnóstico: ${formatRecordDate(item.fechaDiagnostico)}`,
                        item.tratamientoActual
                          ? `Tratamiento actual: ${item.tratamientoActual}`
                          : null,
                        item.observaciones
                          ? `Observaciones: ${item.observaciones}`
                          : null,
                      ]}
                    />
                  ))}
                </Stack>
              )}
            </Section>

            <Section title="Antecedentes familiares">
              {(history.family.data ?? []).length === 0 ? (
                <EmptyText />
              ) : (
                <Stack spacing={1.5}>
                  {history.family.data!.map((item) => (
                    <RecordCard
                      key={item.id}
                      title={item.condicionMedica}
                      lines={[
                        `Parentesco: ${item.parentesco}`,
                        item.observaciones
                          ? `Observaciones: ${item.observaciones}`
                          : null,
                      ]}
                    />
                  ))}
                </Stack>
              )}
            </Section>

            <Section title="Alergias">
              {(history.allergies.data ?? []).length === 0 ? (
                <EmptyText />
              ) : (
                <Stack spacing={1.5}>
                  {history.allergies.data!.map((item) => (
                    <RecordCard
                      key={item.id}
                      title={
                        item.sustanciaAlergena ?? "Sustancia no especificada"
                      }
                      lines={[
                        item.nivelSeveridadAlergia
                          ? `Severidad: ${item.nivelSeveridadAlergia}`
                          : null,
                        item.tipoReaccion
                          ? `Reacción: ${item.tipoReaccion}`
                          : null,
                        item.observaciones
                          ? `Observaciones: ${item.observaciones}`
                          : null,
                      ]}
                    />
                  ))}
                </Stack>
              )}
            </Section>

            <Section title="Medicamentos">
              {(history.medications.data ?? []).length === 0 ? (
                <EmptyText />
              ) : (
                <Stack spacing={1.5}>
                  {history.medications.data!.map((item) => (
                    <RecordCard
                      key={item.id}
                      title={item.medicamento}
                      lines={[
                        item.dosis ? `Dosis: ${item.dosis}` : null,
                        item.frecuencia
                          ? `Frecuencia: ${item.frecuencia}`
                          : null,
                        item.viaAdministracion
                          ? `Vía de administración: ${item.viaAdministracion}`
                          : null,
                        item.fechaInicio
                          ? `Inicio: ${formatRecordDate(item.fechaInicio)}`
                          : null,
                        item.fechaFin
                          ? `Fin: ${formatRecordDate(item.fechaFin)}`
                          : null,
                        item.prescritoPor
                          ? `Prescrito por: ${item.prescritoPor}`
                          : null,
                      ]}
                    />
                  ))}
                </Stack>
              )}
            </Section>

            <Section title="Contactos de emergencia">
              {(history.emergencyContacts.data ?? []).length === 0 ? (
                <EmptyText />
              ) : (
                <Stack spacing={1.5}>
                  {history.emergencyContacts.data!.map((item) => (
                    <RecordCard
                      key={item.id}
                      title={item.nombre}
                      lines={[
                        item.parentesco
                          ? `Parentesco: ${item.parentesco}`
                          : null,
                        `Teléfono: ${item.telefono}`,
                        `Dirección: ${item.direccion}`,
                        item.observaciones
                          ? `Observaciones: ${item.observaciones}`
                          : null,
                      ]}
                    />
                  ))}
                </Stack>
              )}
            </Section>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="subtitle1" fontWeight={700} gutterBottom>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function FieldGrid({ fields }: { fields: [string, string][] }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        rowGap: 1.25,
        columnGap: 2,
      }}
    >
      {fields.map(([label, value]) => (
        <Box key={label}>
          <Typography variant="caption" color="text.secondary">
            {label}
          </Typography>
          <Typography variant="body2" fontWeight={500}>
            {value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}

function RecordCard({
  title,
  lines,
}: {
  title: string;
  lines: (string | null)[];
}) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        border: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="body2" fontWeight={700}>
        {title}
      </Typography>
      {lines.filter(Boolean).map((line) => (
        <Typography
          key={line}
          variant="caption"
          color="text.secondary"
          display="block"
        >
          {line}
        </Typography>
      ))}
    </Box>
  );
}

function EmptyText() {
  return (
    <Typography variant="body2" color="text.secondary">
      ---
    </Typography>
  );
}
