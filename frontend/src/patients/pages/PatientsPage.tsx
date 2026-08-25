import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import PersonSearchOutlinedIcon from "@mui/icons-material/PersonSearchOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

import PageHeader from "../../shared/components/common/PageHeader";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";
import { useGetAll as useEstadoCivil } from "../../catalog/hooks/useEstadoCivil";
import { useGetAll as useNivelEscolaridad } from "../../catalog/hooks/useNivelEscolaridad";
import {
  useCreatePatient,
  usePatients,
  useUpdatePatient,
} from "../hooks/usePatients";
import { usePatientCatalogs } from "../hooks/usePatientCatalogs";
import {
  useCreateAllergy,
  useCreateFamilyHistory,
  useCreateMedicalHistory,
  useCreateMedication,
} from "../hooks/usePatientRecords";
import type { Patient, PatientRequest } from "../types/patient.types";

export default function PatientsPage() {
  const { data: patients = [], isLoading, isError } = usePatients();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const selectedPatient = patients.find((patient) => patient.id === selectedId);

  return (
    <>
      <PageHeader
        title="Pacientes"
        description="Información personal e historial médico de los pacientes."
      />
      {isError ? (
        <Alert severity="error">No fue posible cargar los pacientes.</Alert>
      ) : isLoading ? (
        <LoadingState />
      ) : (
        <PatientWorkspace
          patient={selectedPatient ?? null}
          patients={patients}
          isCreating={isCreating}
          onSelectPatient={(patient) => {
            setSelectedId(patient.id);
            setIsCreating(false);
          }}
          onCreatePatient={() => {
            setSelectedId(null);
            setIsCreating(true);
          }}
          onCancel={() => {
            setSelectedId(null);
            setIsCreating(false);
          }}
        />
      )}
    </>
  );
}

function PatientWorkspace({
  patient,
  patients,
  isCreating,
  onSelectPatient,
  onCreatePatient,
  onCancel,
}: {
  patient: Patient | null;
  patients: Patient[];
  isCreating: boolean;
  onSelectPatient: (patient: Patient) => void;
  onCreatePatient: () => void;
  onCancel: () => void;
}) {
  const currentPatient = patient;
  const { data: civilStatuses = [] } = useEstadoCivil();
  const { data: educationLevels = [] } = useNivelEscolaridad();
  const updateMutation = useUpdatePatient();
  const createMutation = useCreatePatient();
  const createMedicalMutation = useCreateMedicalHistory();
  const createFamilyMutation = useCreateFamilyHistory();
  const createAllergyMutation = useCreateAllergy();
  const createMedicationMutation = useCreateMedication();
  const { showSuccess } = useNotification();
  const [form, setForm] = useState<PatientRequest>(() =>
    currentPatient ? toRequest(currentPatient) : emptyPatientRequest(),
  );
  const [optionalRecords, setOptionalRecords] = useState<
    Record<OptionalSection, OptionalRecord[]>
  >({
    personalHistory: [],
    familyHistory: [],
    allergies: [],
    medications: [],
  });

  const updateField = (
    field: keyof PatientRequest,
    value: string | number | null,
  ) => setForm((current) => ({ ...current, [field]: value }));
  const isNewPatient = isCreating;
  const catalogs = usePatientCatalogs(true);
  const isSaving =
    updateMutation.isPending ||
    createMutation.isPending ||
    createMedicalMutation.isPending ||
    createFamilyMutation.isPending ||
    createAllergyMutation.isPending ||
    createMedicationMutation.isPending;
  const save = async () => {
    let patientId = currentPatient?.id;
    if (isNewPatient) {
      const createdPatient = await createMutation.mutateAsync(form);
      patientId = createdPatient.id;
    }

    if (!patientId) return;

    if (!isNewPatient) {
      await updateMutation.mutateAsync({ id: patientId, request: form });
    }

    await Promise.all([
      ...optionalRecords.personalHistory.map((record) =>
        createMedicalMutation.mutateAsync({
          pacienteId: patientId!,
          condicionMedicaId: record.condicionMedicaId!,
          fechaDiagnostico: record.fechaDiagnostico!,
          tratamientoActual: record.tratamientoActual!,
          observaciones: record.observaciones,
        }),
      ),
      ...optionalRecords.familyHistory.map((record) =>
        createFamilyMutation.mutateAsync({
          pacienteId: patientId!,
          condicionMedicaId: record.condicionMedicaId!,
          parentescoId: record.parentescoId!,
          observaciones: record.observaciones,
        }),
      ),
      ...optionalRecords.allergies.map((record) =>
        createAllergyMutation.mutateAsync({
          pacienteId: patientId!,
          sustanciaAlergenaId: record.sustanciaAlergenaId!,
          nivelSeveridadAlergiaId: record.nivelSeveridadAlergiaId,
          tipoReaccion: record.tipoReaccion,
          observaciones: record.observaciones,
          estadoId: 1,
        }),
      ),
      ...optionalRecords.medications.map((record) =>
        createMedicationMutation.mutateAsync({
          pacienteId: patientId!,
          medicamentoId: record.medicamentoId!,
          dosis: record.dosis,
          frecuencia: record.frecuencia,
          viaAdministracion: record.viaAdministracion,
          fechaInicio: record.fechaInicio,
          fechaFin: record.fechaFin,
          prescritoPor: record.prescritoPor,
        }),
      ),
    ]);

    showSuccess(
      isNewPatient
        ? "El paciente y su información fueron registrados correctamente."
        : "El paciente y su información fueron actualizados correctamente.",
    );
    if (isNewPatient) onCancel();
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "minmax(220px, 30%) minmax(0, 1fr)",
        },
        height: { xs: "auto", md: 620 },
        minHeight: { xs: 400, md: 560 },
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          minHeight: 0,
          overflowY: "auto",
          borderRight: { xs: 0, md: 1 },
          borderBottom: { xs: 1, md: 0 },
          borderColor: "divider",
        }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="overline"
            color="text.secondary"
            fontWeight={700}
          >
            Pacientes
          </Typography>
        </Box>
        <Divider />
        <Stack spacing={0.5} sx={{ p: 1.25 }}>
          {patients.map((item) => (
            <Button
              key={item.id}
              onClick={() => {
                onSelectPatient(item);
                setForm(toRequest(item));
              }}
              sx={{
                display: "block",
                width: "100%",
                p: 1.25,
                borderRadius: 1.5,
                textAlign: "left",
                color:
                  item.id === currentPatient?.id
                    ? "primary.main"
                    : "text.primary",
                bgcolor:
                  item.id === currentPatient?.id
                    ? "action.selected"
                    : "transparent",
              }}
            >
              {getPatientInitials(item)}
              <Typography
                variant="caption"
                display="block"
                color="text.secondary"
              >
                {formatSex(item.sexo)} · {item.edad} años
              </Typography>
            </Button>
          ))}
        </Stack>
      </Box>
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr)",
          minWidth: 0,
          minHeight: 0,
          overflow: "hidden",
          p: { xs: 2, md: 3 },
        }}
      >
        {!currentPatient && !isCreating ? (
          <EmptySelectionState onCreate={onCreatePatient} />
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 2,
                flexWrap: "wrap",
                pb: 1.5,
                borderBottom: 1,
                borderColor: "divider",
              }}
            >
              <Box>
                <Stack direction="row" spacing={1} alignItems="center">
                  <PersonOutlinedIcon color="primary" />
                  <Typography variant="h5" fontWeight={700}>
                    {isNewPatient
                      ? "Nuevo paciente"
                      : `${currentPatient?.nombre} ${currentPatient?.apellido}`}
                  </Typography>
                </Stack>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.5 }}
                >
                  Información personal
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<SaveOutlinedIcon />}
                onClick={save}
                disabled={isSaving}
              >
                {isSaving
                  ? "Guardando..."
                  : isNewPatient
                    ? "Crear paciente"
                    : "Guardar cambios"}
              </Button>
            </Box>
            <Box sx={{ minHeight: 0, overflowY: "auto", pt: 3 }}>
              <Stack spacing={3}>
                {(updateMutation.error || createMutation.error) && (
                  <Alert severity="error">
                    {getApiErrorMessage(
                      updateMutation.error ?? createMutation.error,
                    )}
                  </Alert>
                )}
                <PersonalForm
                  form={form}
                  updateField={updateField}
                  civilStatuses={civilStatuses}
                  educationLevels={educationLevels}
                  status={currentPatient?.estado ?? "Pendiente"}
                />
                {(isNewPatient || currentPatient) && (
                  <OptionalSectionsSelector
                    records={optionalRecords}
                    onAdd={(section) =>
                      setOptionalRecords((current) => ({
                        ...current,
                        [section]: [...current[section], createEmptyRecord()],
                      }))
                    }
                    onRemove={(section, recordId) =>
                      setOptionalRecords((current) => ({
                        ...current,
                        [section]: current[section].filter(
                          (record) => record.id !== recordId,
                        ),
                      }))
                    }
                    onChangeRecord={(section, recordId, changes) =>
                      setOptionalRecords((current) => ({
                        ...current,
                        [section]: current[section].map((record) =>
                          record.id === recordId
                            ? { ...record, ...changes }
                            : record,
                        ),
                      }))
                    }
                    catalogs={catalogs}
                  />
                )}
              </Stack>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
}

type OptionalSection = keyof {
  personalHistory: boolean;
  familyHistory: boolean;
  allergies: boolean;
  medications: boolean;
};

interface OptionalRecord {
  id: string;
  condicionMedicaId?: number;
  parentescoId?: number;
  sustanciaAlergenaId?: number;
  nivelSeveridadAlergiaId?: number;
  medicamentoId?: number;
  fechaDiagnostico?: string;
  tratamientoActual?: string;
  tipoReaccion?: string;
  dosis?: string;
  frecuencia?: string;
  viaAdministracion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  prescritoPor?: string;
  observaciones?: string;
}

function createEmptyRecord(): OptionalRecord {
  return { id: `${Date.now()}-${Math.random()}` };
}

function OptionalSectionsSelector({
  records,
  catalogs,
  onAdd,
  onRemove,
  onChangeRecord,
}: {
  records: Record<OptionalSection, OptionalRecord[]>;
  catalogs: ReturnType<typeof usePatientCatalogs>;
  onAdd: (section: OptionalSection) => void;
  onRemove: (section: OptionalSection, recordId: string) => void;
  onChangeRecord: (
    section: OptionalSection,
    recordId: string,
    changes: Partial<OptionalRecord>,
  ) => void;
}) {
  const sections: { id: OptionalSection; label: string }[] = [
    { id: "personalHistory", label: "Antecedentes médicos personales" },
    { id: "familyHistory", label: "Antecedentes familiares" },
    { id: "allergies", label: "Alergias" },
    { id: "medications", label: "Medicación" },
  ];

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
        Secciones opcionales
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Seleccione las secciones que desea completar para este paciente.
      </Typography>
      <Stack spacing={1}>
        {sections.map((section) => (
          <Box key={section.id}>
            <Button
              variant="text"
              color="primary"
              onClick={() => onAdd(section.id)}
              sx={{ px: 0, justifyContent: "flex-start", fontWeight: 700 }}
            >
              + {section.label}
            </Button>
            <Stack spacing={1.5}>
              {records[section.id].map((record, index) => (
                <Box key={record.id} sx={{ pl: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      mb: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="text.secondary">
                      {section.label} {index + 1}
                    </Typography>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteOutlineOutlinedIcon />}
                      onClick={() => onRemove(section.id, record.id)}
                    >
                      Quitar
                    </Button>
                  </Box>
                  <OptionalSectionForm
                    section={section.id}
                    catalogs={catalogs}
                    record={record}
                    onChange={(changes) =>
                      onChangeRecord(section.id, record.id, changes)
                    }
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}

function OptionalSectionForm({
  section,
  catalogs,
  record,
  onChange,
}: {
  section: OptionalSection;
  catalogs: ReturnType<typeof usePatientCatalogs>;
  record: OptionalRecord;
  onChange: (changes: Partial<OptionalRecord>) => void;
}) {
  const selectOptions = (
    options: { id: number; nombre: string; nombreComercial?: string | null }[],
  ) =>
    options.map((option) => (
      <MenuItem key={option.id} value={option.id}>
        {option.nombre}
        {option.nombreComercial ? ` · ${option.nombreComercial}` : ""}
      </MenuItem>
    ));

  if (section === "personalHistory") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
          pl: 2,
          pb: 1,
        }}
      >
        <TextField
          select
          label="Condición médica"
          value={record.condicionMedicaId ?? ""}
          onChange={(event) =>
            onChange({ condicionMedicaId: Number(event.target.value) })
          }
          required
        >
          <MenuItem value="">Seleccione una condición</MenuItem>
          {selectOptions(catalogs.conditions.data ?? [])}
        </TextField>
        <TextField
          label="Fecha de diagnóstico"
          type="date"
          value={record.fechaDiagnostico ?? ""}
          onChange={(event) =>
            onChange({ fechaDiagnostico: event.target.value })
          }
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          label="Tratamiento actual"
          value={record.tratamientoActual ?? ""}
          onChange={(event) =>
            onChange({ tratamientoActual: event.target.value })
          }
          required
        />
        <TextField
          label="Observaciones"
          value={record.observaciones ?? ""}
          onChange={(event) => onChange({ observaciones: event.target.value })}
          multiline
          minRows={2}
        />
      </Box>
    );
  }

  if (section === "familyHistory") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
          pl: 2,
          pb: 1,
        }}
      >
        <TextField
          select
          label="Condición médica"
          value={record.condicionMedicaId ?? ""}
          onChange={(event) =>
            onChange({ condicionMedicaId: Number(event.target.value) })
          }
          required
        >
          <MenuItem value="">Seleccione una condición</MenuItem>
          {selectOptions(catalogs.conditions.data ?? [])}
        </TextField>
        <TextField
          select
          label="Parentesco"
          value={record.parentescoId ?? ""}
          onChange={(event) =>
            onChange({ parentescoId: Number(event.target.value) })
          }
          required
        >
          <MenuItem value="">Seleccione un parentesco</MenuItem>
          {selectOptions(catalogs.relationships.data ?? [])}
        </TextField>
        <TextField
          label="Observaciones"
          value={record.observaciones ?? ""}
          onChange={(event) => onChange({ observaciones: event.target.value })}
          multiline
          minRows={2}
          sx={{ gridColumn: { sm: "1 / -1" } }}
        />
      </Box>
    );
  }

  if (section === "allergies") {
    return (
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
          pl: 2,
          pb: 1,
        }}
      >
        <TextField
          select
          label="Sustancia alergénica"
          value={record.sustanciaAlergenaId ?? ""}
          onChange={(event) =>
            onChange({ sustanciaAlergenaId: Number(event.target.value) })
          }
          required
        >
          <MenuItem value="">Seleccione una sustancia</MenuItem>
          {selectOptions(catalogs.allergens.data ?? [])}
        </TextField>
        <TextField
          select
          label="Severidad"
          value={record.nivelSeveridadAlergiaId ?? ""}
          onChange={(event) =>
            onChange({ nivelSeveridadAlergiaId: Number(event.target.value) })
          }
        >
          <MenuItem value="">Seleccione una severidad</MenuItem>
          {selectOptions(catalogs.severities.data ?? [])}
        </TextField>
        <TextField
          label="Tipo de reacción"
          value={record.tipoReaccion ?? ""}
          onChange={(event) => onChange({ tipoReaccion: event.target.value })}
        />
        <TextField
          label="Observaciones"
          value={record.observaciones ?? ""}
          onChange={(event) => onChange({ observaciones: event.target.value })}
          multiline
          minRows={2}
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
        gap: 2,
        pl: 2,
        pb: 1,
      }}
    >
      <TextField
        select
        label="Medicamento"
        value={record.medicamentoId ?? ""}
        onChange={(event) =>
          onChange({ medicamentoId: Number(event.target.value) })
        }
        required
      >
        <MenuItem value="">Seleccione un medicamento</MenuItem>
        {selectOptions(catalogs.medications.data ?? [])}
      </TextField>
      <TextField
        label="Dosis"
        value={record.dosis ?? ""}
        onChange={(event) => onChange({ dosis: event.target.value })}
      />
      <TextField
        label="Frecuencia"
        value={record.frecuencia ?? ""}
        onChange={(event) => onChange({ frecuencia: event.target.value })}
      />
      <TextField
        label="Vía de administración"
        value={record.viaAdministracion ?? ""}
        onChange={(event) =>
          onChange({ viaAdministracion: event.target.value })
        }
      />
      <TextField
        label="Fecha de inicio"
        type="date"
        value={record.fechaInicio ?? ""}
        onChange={(event) => onChange({ fechaInicio: event.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Fecha de finalización"
        type="date"
        value={record.fechaFin ?? ""}
        onChange={(event) => onChange({ fechaFin: event.target.value })}
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        label="Quién lo prescribió"
        value={record.prescritoPor ?? ""}
        onChange={(event) => onChange({ prescritoPor: event.target.value })}
      />
    </Box>
  );
}

function PersonalForm({
  form,
  updateField,
  civilStatuses,
  educationLevels,
  status,
}: {
  form: PatientRequest;
  updateField: (
    field: keyof PatientRequest,
    value: string | number | null,
  ) => void;
  civilStatuses: { id: number; nombre: string }[];
  educationLevels: { id: number; nombre: string }[];
  status: string | null;
}) {
  return (
    <Box>
      <Typography variant="h6" fontWeight={700} sx={{ mb: 1.5 }}>
        Datos generales
      </Typography>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" },
          gap: 2,
        }}
      >
        <TextField
          label="Nombre"
          value={form.nombre}
          onChange={(event) => updateField("nombre", event.target.value)}
          required
        />
        <TextField
          label="Apellido"
          value={form.apellido}
          onChange={(event) => updateField("apellido", event.target.value)}
          required
        />
        <TextField
          label="DPI"
          value={form.dpi ?? ""}
          onChange={(event) => updateField("dpi", event.target.value)}
        />
        <TextField
          label="Fecha de nacimiento"
          type="date"
          value={form.fechaNacimiento}
          onChange={(event) =>
            updateField("fechaNacimiento", event.target.value)
          }
          InputLabelProps={{ shrink: true }}
          required
        />
        <TextField
          select
          label="Sexo"
          value={form.sexo}
          onChange={(event) => updateField("sexo", event.target.value)}
        >
          <MenuItem value="M">Masculino</MenuItem>
          <MenuItem value="F">Femenino</MenuItem>
        </TextField>
        <TextField
          label="Ocupación"
          value={form.ocupacion ?? ""}
          onChange={(event) => updateField("ocupacion", event.target.value)}
        />
        <TextField
          label="Dirección"
          value={form.direccion ?? ""}
          onChange={(event) => updateField("direccion", event.target.value)}
        />
        <TextField
          label="Teléfono"
          value={form.telefono ?? ""}
          onChange={(event) => updateField("telefono", event.target.value)}
        />
        <Select
          displayEmpty
          value={form.estadoCivilId ?? ""}
          onChange={(event) =>
            updateField(
              "estadoCivilId",
              event.target.value ? Number(event.target.value) : null,
            )
          }
        >
          <MenuItem value="">
            <em>Estado civil</em>
          </MenuItem>
          {civilStatuses.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.nombre}
            </MenuItem>
          ))}
        </Select>
        <Select
          displayEmpty
          value={form.nivelEscolaridadId ?? ""}
          onChange={(event) =>
            updateField(
              "nivelEscolaridadId",
              event.target.value ? Number(event.target.value) : null,
            )
          }
        >
          <MenuItem value="">
            <em>Nivel de escolaridad</em>
          </MenuItem>
          {educationLevels.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              {item.nombre}
            </MenuItem>
          ))}
        </Select>
        <TextField label="Estado del paciente" value={status ?? "-"} disabled />
      </Box>
    </Box>
  );
}

function LoadingState() {
  return (
    <Card variant="outlined">
      <CardContent
        sx={{
          minHeight: 240,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </CardContent>
    </Card>
  );
}
function EmptySelectionState({ onCreate }: { onCreate: () => void }) {
  return (
    <Box
      sx={{
        minHeight: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: 1,
        borderColor: "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={1} alignItems="center" sx={{ p: 3 }}>
        <PersonSearchOutlinedIcon
          sx={{ fontSize: 64, color: "text.disabled" }}
        />
        <Typography variant="h6" fontWeight={700}>
          Seleccione un paciente
        </Typography>
        <Typography variant="body2" color="text.secondary" textAlign="center">
          Elija un paciente de la lista para consultar o editar su información.
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={onCreate}
          sx={{ mt: 1 }}
        >
          Nuevo paciente
        </Button>
      </Stack>
    </Box>
  );
}

function getPatientInitials(patient: Patient): string {
  return [patient.nombre, patient.apellido]
    .flatMap((value) => value.trim().split(/\s+/))
    .filter(Boolean)
    .map((value) => value.charAt(0).toUpperCase())
    .join("");
}

function formatSex(sex: string): string {
  return sex.toUpperCase() === "M"
    ? "Masculino"
    : sex.toUpperCase() === "F"
      ? "Femenino"
      : sex;
}

function emptyPatientRequest(): PatientRequest {
  return {
    nombre: "",
    apellido: "",
    dpi: "",
    fechaNacimiento: "",
    sexo: "",
    direccion: "",
    telefono: "",
    ocupacion: "",
    estadoCivilId: null,
    nivelEscolaridadId: null,
  };
}
function toRequest(patient: Patient): PatientRequest {
  return {
    nombre: patient.nombre,
    apellido: patient.apellido,
    dpi: patient.dpi ?? "",
    fechaNacimiento: patient.fechaNacimiento,
    sexo: patient.sexo,
    direccion: patient.direccion ?? "",
    telefono: patient.telefono ?? "",
    ocupacion: patient.ocupacion ?? "",
    estadoCivilId: patient.estadoCivilId,
    nivelEscolaridadId: patient.nivelEscolaridadId,
  };
}
