import { useMemo, useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";

import AgendaToolbar from "../components/AgendaToolbar";
import AgendaSummary from "../components/AgendaSummary";
import DayAgenda from "../components/DayAgenda";
import AppointmentDialog from "../components/AppointmentDialog";
import { useAgenda } from "../hooks/useAgenda";

import type { Appointment } from "../types/appointment.types";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";
import AppointmentDetailsDrawer from "../components/AppointmentDetailsDrawer";
import { useStartSession } from "../../sessions/hooks/useStartSession";

import { useNavigate } from "react-router-dom";
import StartSessionDialog from "../../sessions/components/StartSessionDialog";
import { useSessionTypes } from "../../sessions/hooks/useSessionTypes";
import type { SessionRequest } from "../../sessions/types/session.types";
import {
  toDateInputValue,
  toLocalDateTimeString,
} from "../../shared/utils/dateUtils";
import { getApiErrorMessage } from "../../shared/utils/apiError";

export default function AgendaPage() {
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(
    toDateInputValue(new Date()),
  );

  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const [appointmentInitialStartTime, setAppointmentInitialStartTime] =
    useState<string | undefined>();

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const {
    data: appointments = [],
    isLoading,
    isError,
  } = useAgenda(selectedDate);

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) =>
          new Date(a.fechaHoraInicio).getTime() -
          new Date(b.fechaHoraInicio).getTime(),
      ),
    [appointments],
  );

  const agendaAppointments = useMemo(
    () =>
      appointments
        .filter(
          (appointment) =>
            appointment.estadoId !== APPOINTMENT_STATUS.CANCELLED,
        )
        .sort(
          (a, b) =>
            new Date(a.fechaHoraInicio).getTime() -
            new Date(b.fechaHoraInicio).getTime(),
        ),
    [appointments],
  );

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleCreateAppointment = () => {
    setAppointmentInitialStartTime(undefined);
    setAppointmentDialogKey((current) => current + 1);
    setAppointmentDialogOpen(true);
  };

  const handleOpenStartSession = (appointment: Appointment) => {
    setSelectedSessionTypeId(null);
    setStartSessionAppointment(appointment);
    setSelectedAppointment(null);
  };

  const handleCloseStartSession = () => {
    if (startSessionMutation.isPending) {
      return;
    }
    setStartSessionAppointment(null);
    setSelectedSessionTypeId(null);
    startSessionMutation.reset();
  };
  const handleEmptySlotClick = (time: string) => {
    setAppointmentInitialStartTime(time);
    setAppointmentDialogKey((current) => current + 1);
    setAppointmentDialogOpen(true);
  };

  const [appointmentDialogKey, setAppointmentDialogKey] = useState(0);

  const [startSessionAppointment, setStartSessionAppointment] =
    useState<Appointment | null>(null);

  const [selectedSessionTypeId, setSelectedSessionTypeId] = useState<
    number | null
  >(null);

  const { data: sessionTypes = [], isLoading: loadingSessionTypes } =
    useSessionTypes(Boolean(startSessionAppointment));

  const startSessionMutation = useStartSession();

  const handleConfirmStartSession = () => {
    if (!startSessionAppointment || selectedSessionTypeId === null) {
      return;
    }

    const request: SessionRequest = {
      pacienteId: startSessionAppointment.pacienteId,
      usuarioId: startSessionAppointment.usuarioId,
      tipoSesionId: selectedSessionTypeId,
      fechaSesion: toLocalDateTimeString(new Date()),
      citaId: startSessionAppointment.id,
    };

    startSessionMutation.mutate(request, {
      onSuccess: (session) => {
        setStartSessionAppointment(null);
        setSelectedSessionTypeId(null);

        navigate(`/sesion/${session.id}`);
      },
    });
  };

  return (
    <Box>
      <AgendaToolbar
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        onCreateAppointment={handleCreateAppointment}
      />

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          No fue posible cargar la agenda.
        </Alert>
      )}

      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 8,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <AgendaSummary
            appointments={sortedAppointments}
            selectedDate={selectedDate}
          />
          <DayAgenda
            appointments={agendaAppointments}
            selectedDate={selectedDate}
            onAppointmentClick={handleAppointmentClick}
            onEmptySlotClick={handleEmptySlotClick}
          />
        </>
      )}

      <AppointmentDialog
        key={appointmentDialogKey}
        open={appointmentDialogOpen}
        initialDate={selectedDate}
        initialStartTime={appointmentInitialStartTime}
        onClose={() => setAppointmentDialogOpen(false)}
      />

      <AppointmentDetailsDrawer
        open={selectedAppointment !== null}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStartSession={handleOpenStartSession}
      />

      <StartSessionDialog
        open={startSessionAppointment !== null}
        appointment={startSessionAppointment}
        sessionTypes={sessionTypes}
        selectedSessionTypeId={selectedSessionTypeId}
        loading={startSessionMutation.isPending}
        loadingSessionTypes={loadingSessionTypes}
        error={
          startSessionMutation.error
            ? getApiErrorMessage(startSessionMutation.error)
            : null
        }
        onClose={handleCloseStartSession}
        onSessionTypeChange={setSelectedSessionTypeId}
        onConfirm={handleConfirmStartSession}
      />
    </Box>
  );
}
