import { useMemo, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import type {
  AppointmentFormValues,
  PatientAssignment,
} from "../types/appointment.types";

import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";

import { useAssignedPatients } from "../hooks/useAssignedPatients";

import { useCreateAppointment } from "../hooks/useCreateAppointment";

import { combineDateAndTime } from "../../shared/utils/dateUtils";

import { useAuth } from "../../auth/hooks/useAuth";

interface AppointmentDialogProps {
  open: boolean;
  initialDate: string;
  initialStartTime?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AppointmentDialog({
  open,
  initialDate,
  initialStartTime,
  onClose,
  onSuccess,
}: AppointmentDialogProps) {
  const { user } = useAuth();

  const usuarioId = user?.id;

  const {
    data: assignedPatients = [],
    isLoading: isPatientsLoading,
    isError: isPatientsError,
  } = useAssignedPatients(usuarioId);

  function createInitialForm(
    initialDate: string,
    initialStartTime?: string,
  ): AppointmentFormValues {
    const startTime = initialStartTime || "08:00";

    return {
      pacienteId: null,
      fecha: initialDate,
      horaInicio: startTime,
      horaFin: addMinutesToTime(startTime, 60),
      motivo: "",
      observaciones: "",
    };
  }

  const mutation = useCreateAppointment();

  const [form, setForm] = useState<AppointmentFormValues>(() =>
    createInitialForm(initialDate, initialStartTime),
  );

  const selectedPatient = useMemo(
    () =>
      assignedPatients.find(
        (patient) => patient.pacienteId === form.pacienteId,
      ),
    [assignedPatients, form.pacienteId],
  );

  const timeError =
    form.horaInicio !== "" &&
    form.horaFin !== "" &&
    form.horaFin <= form.horaInicio;

  const canSubmit =
    form.pacienteId !== null &&
    Boolean(form.fecha) &&
    Boolean(form.horaInicio) &&
    Boolean(form.horaFin) &&
    !timeError &&
    !mutation.isPending &&
    usuarioId !== undefined;

  const handleChange = (
    field: keyof AppointmentFormValues,
    value: string | number | null,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleStartTimeChange = (value: string) => {
    setForm((current) => {
      const currentDuration = getTimeDifferenceInMinutes(
        current.horaInicio,
        current.horaFin,
      );

      const duration = currentDuration > 0 ? currentDuration : 60;

      return {
        ...current,
        horaInicio: value,
        horaFin: addMinutesToTime(value, duration),
      };
    });
  };

  const handleClose = () => {
    if (mutation.isPending) {
      return;
    }
    setForm(createInitialForm(initialDate, initialStartTime));
    onClose();
  };

  const handleSubmit = async () => {
    if (!canSubmit || usuarioId === undefined) {
      return;
    }

    const fechaHoraInicio = combineDateAndTime(form.fecha, form.horaInicio);

    const fechaHoraFin = combineDateAndTime(form.fecha, form.horaFin);

    try {
      await mutation.mutateAsync({
        pacienteId: form.pacienteId!,
        usuarioId,
        fechaHoraInicio,
        fechaHoraFin,
        motivo: form.motivo.trim() || undefined,
        observaciones: form.observaciones.trim() || undefined,
        estadoId: APPOINTMENT_STATUS.SCHEDULED,
      });
      setForm(createInitialForm(initialDate, initialStartTime));

      onSuccess?.();
      onClose();
    } catch {
      /*
       * The mutation error is displayed below.
       */
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Nueva cita</DialogTitle>

      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {mutation.isError && (
            <Alert severity="error">
              No fue posible programar la cita. Verifique los datos e intente
              nuevamente.
            </Alert>
          )}

          {isPatientsError && (
            <Alert severity="error">
              No fue posible cargar los pacientes asignados.
            </Alert>
          )}

          {!usuarioId && (
            <Alert severity="error">
              No fue posible identificar al psicólogo actual.
            </Alert>
          )}

          <FormControl
            fullWidth
            required
            disabled={isPatientsLoading || mutation.isPending}
          >
            <InputLabel>Paciente</InputLabel>

            <Select
              value={form.pacienteId ?? ""}
              label="Paciente"
              onChange={(event) =>
                handleChange(
                  "pacienteId",
                  event.target.value ? Number(event.target.value) : null,
                )
              }
            >
              <MenuItem value="">
                <em>Seleccionar paciente</em>
              </MenuItem>

              {assignedPatients.map((patient: PatientAssignment) => (
                <MenuItem key={patient.pacienteId} value={patient.pacienteId}>
                  {patient.pacienteNombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            required
            type="date"
            label="Fecha"
            value={form.fecha}
            onChange={(event) => handleChange("fecha", event.target.value)}
            disabled={mutation.isPending}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <TextField
              fullWidth
              required
              type="time"
              label="Hora de inicio"
              value={form.horaInicio}
              onChange={(event) => handleStartTimeChange(event.target.value)}
              disabled={mutation.isPending}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />

            <TextField
              fullWidth
              required
              type="time"
              label="Hora de finalización"
              value={form.horaFin}
              onChange={(event) => handleChange("horaFin", event.target.value)}
              disabled={mutation.isPending}
              error={timeError}
              helperText={
                timeError
                  ? "La hora de finalización debe ser posterior a la hora de inicio."
                  : undefined
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
            />
          </Stack>

          <TextField
            fullWidth
            label="Motivo"
            value={form.motivo}
            onChange={(event) => handleChange("motivo", event.target.value)}
            disabled={mutation.isPending}
            inputProps={{
              maxLength: 255,
            }}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Observaciones"
            value={form.observaciones}
            onChange={(event) =>
              handleChange("observaciones", event.target.value)
            }
            disabled={mutation.isPending}
          />

          {selectedPatient && (
            <Alert severity="info">
              Paciente seleccionado:{" "}
              <strong>{selectedPatient.pacienteNombre}</strong>
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} disabled={mutation.isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!canSubmit}
        >
          {mutation.isPending ? "Programando..." : "Programar cita"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function addMinutesToTime(time: string, minutes: number): string {
  const [hours, mins] = time.split(":").map(Number);

  const totalMinutes = hours * 60 + mins + minutes;

  const normalizedMinutes = Math.min(totalMinutes, 23 * 60 + 59);
  const resultHours = Math.floor(normalizedMinutes / 60);
  const resultMinutes = normalizedMinutes % 60;

  return (
    `${String(resultHours).padStart(2, "0")}:` +
    `${String(resultMinutes).padStart(2, "0")}`
  );
}

function getTimeDifferenceInMinutes(start: string, end: string): number {
  if (!start || !end) {
    return 0;
  }

  const [startHours, startMinutes] = start.split(":").map(Number);

  const [endHours, endMinutes] = end.split(":").map(Number);

  return endHours * 60 + endMinutes - startHours * 60 - startMinutes;
}
