import { Controller, useForm } from "react-hook-form";

import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type {
  AppointmentFormValues,
  PatientAssignment,
} from "../types/appointment.types";

interface AppointmentFormProps {
  mode: "create" | "edit";
  patients: PatientAssignment[];
  initialValues?: AppointmentFormValues;
  isLoading?: boolean;
  isSubmitting?: boolean;
  onSubmit: (values: AppointmentFormValues) => void | Promise<void>;
  onCancel: () => void;
}

const DEFAULT_VALUES: AppointmentFormValues = {
  pacienteId: null,
  fecha: "",
  horaInicio: "",
  horaFin: "",
  motivo: "",
  observaciones: "",
};

export default function AppointmentForm({
  mode,
  patients,
  initialValues,
  isLoading = false,
  isSubmitting = false,
  onSubmit,
  onCancel,
}: AppointmentFormProps) {
  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    defaultValues: initialValues ?? DEFAULT_VALUES,
  });

  const submit = async (values: AppointmentFormValues) => {
    if (values.fecha && values.horaInicio && values.horaFin) {
      const start = new Date(`${values.fecha}T${values.horaInicio}`);

      const end = new Date(`${values.fecha}T${values.horaFin}`);

      if (end <= start) {
        setError("horaFin", {
          type: "validate",
          message:
            "La hora de finalización debe ser posterior a la hora de inicio.",
        });

        return;
      }
    }

    await onSubmit(values);
  };

  const title = mode === "create" ? "Nueva cita" : "Editar cita";

  const submitLabel = mode === "create" ? "Guardar cita" : "Guardar cambios";

  return (
    <Box component="form" onSubmit={handleSubmit(submit)}>
      <Stack spacing={3}>
        <Typography variant="h5" fontWeight={600}>
          {title}
        </Typography>

        {/* Patient */}

        <Controller
          name="pacienteId"
          control={control}
          rules={{
            required: "El paciente es obligatorio.",
          }}
          render={({ field }) => {
            const selectedPatient =
              patients.find((patient) => patient.pacienteId === field.value) ??
              null;

            return (
              <Autocomplete
                options={patients}
                value={selectedPatient}
                loading={isLoading}
                getOptionLabel={(patient) => patient.pacienteNombre}
                isOptionEqualToValue={(option, value) =>
                  option.pacienteId === value.pacienteId
                }
                onChange={(_, patient) => {
                  field.onChange(patient?.pacienteId ?? null);
                }}
                disabled={isLoading || isSubmitting}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Paciente"
                    required
                    error={!!errors.pacienteId}
                    helperText={errors.pacienteId?.message}
                    slotProps={{
                      input: {
                        ...params.InputProps,
                        endAdornment: (
                          <>
                            {isLoading && <CircularProgress size={20} />}

                            {params.InputProps.endAdornment}
                          </>
                        ),
                      },
                    }}
                  />
                )}
              />
            );
          }}
        />

        {/* Date */}

        <Controller
          name="fecha"
          control={control}
          rules={{
            required: "La fecha es obligatoria.",
          }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Fecha"
              type="date"
              required
              fullWidth
              disabled={isSubmitting}
              error={!!errors.fecha}
              helperText={errors.fecha?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          )}
        />

        {/* Times */}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          <Controller
            name="horaInicio"
            control={control}
            rules={{
              required: "La hora de inicio es obligatoria.",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hora de inicio"
                type="time"
                required
                fullWidth
                disabled={isSubmitting}
                error={!!errors.horaInicio}
                helperText={errors.horaInicio?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />

          <Controller
            name="horaFin"
            control={control}
            rules={{
              required: "La hora de finalización es obligatoria.",
            }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Hora de finalización"
                type="time"
                required
                fullWidth
                disabled={isSubmitting}
                error={!!errors.horaFin}
                helperText={errors.horaFin?.message}
                slotProps={{
                  inputLabel: {
                    shrink: true,
                  },
                }}
              />
            )}
          />
        </Box>

        {/* Reason */}

        <Controller
          name="motivo"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Motivo"
              fullWidth
              disabled={isSubmitting}
              multiline
              minRows={2}
            />
          )}
        />

        {/* Observations */}

        <Controller
          name="observaciones"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Observaciones"
              fullWidth
              disabled={isSubmitting}
              multiline
              minRows={4}
            />
          )}
        />

        {/* Actions */}

        <Stack
          direction={{
            xs: "column-reverse",
            sm: "row",
          }}
          justifyContent="flex-end"
          spacing={2}
        >
          <Button
            type="button"
            variant="outlined"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting || isLoading}
          >
            {isSubmitting ? "Guardando..." : submitLabel}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
