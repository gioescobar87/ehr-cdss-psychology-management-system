import { useMemo, useState } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";

import AgendaToolbar, {
  type AgendaViewMode,
} from "../components/AgendaToolbar";
import AgendaSummary from "../components/AgendaSummary";
import DayAgenda from "../components/DayAgenda";
import CalendarMonthView from "../components/CalendarMonthView";
import AppointmentDialog from "../components/AppointmentDialog";
import { useAgenda } from "../hooks/useAgenda";
import { useAppointments } from "../hooks/useAppointments";

import type { Appointment } from "../types/appointment.types";
import { APPOINTMENT_STATUS } from "../constants/appointmentStatus";
import AppointmentDetailsDrawer from "../components/AppointmentDetailsDrawer";
import { useStartSession } from "../../sessions/hooks/useStartSession";

import { useNavigate } from "react-router-dom";
import StartSessionDialog from "../../sessions/components/StartSessionDialog";
import { useSessionTypes } from "../../sessions/hooks/useSessionTypes";
import type { SessionRequest } from "../../sessions/types/session.types";
import {
  addDays,
  addMonths,
  formatAppointmentDate,
  formatMonthYear,
  isToday,
  toDateInputValue,
  toLocalDateTimeString,
  toMonthStart,
} from "../../shared/utils/dateUtils";
import { getApiErrorMessage } from "../../shared/utils/apiError";

export default function AgendaPage() {
  const navigate = useNavigate();

  const [viewMode, setViewMode] = useState<AgendaViewMode>("day");

  const [selectedDate, setSelectedDate] = useState(
    toDateInputValue(new Date()),
  );

  const [calendarMonth, setCalendarMonth] = useState(
    toMonthStart(toDateInputValue(new Date())),
  );

  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);

  const [appointmentInitialStartTime, setAppointmentInitialStartTime] =
    useState<string | undefined>();

  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  const {
    data: dayAppointments = [],
    isLoading: dayLoading,
    isError: dayError,
  } = useAgenda(selectedDate);

  const {
    data: monthAppointments = [],
    isLoading: monthLoading,
    isError: monthError,
  } = useAppointments(viewMode === "calendar");

  const sortedAppointments = useMemo(
    () =>
      [...dayAppointments].sort(
        (a, b) =>
          new Date(a.fechaHoraInicio).getTime() -
          new Date(b.fechaHoraInicio).getTime(),
      ),
    [dayAppointments],
  );

  const agendaAppointments = useMemo(
    () =>
      dayAppointments
        .filter(
          (appointment) =>
            appointment.estadoId !== APPOINTMENT_STATUS.CANCELLED,
        )
        .sort(
          (a, b) =>
            new Date(a.fechaHoraInicio).getTime() -
            new Date(b.fechaHoraInicio).getTime(),
        ),
    [dayAppointments],
  );

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleSelectDay = (date: string) => {
    setSelectedDate(date);
    setViewMode("day");
  };

  const handlePrevious = () => {
    if (viewMode === "day") {
      setSelectedDate((current) => addDays(current, -1));
    } else {
      setCalendarMonth((current) => addMonths(current, -1));
    }
  };

  const handleNext = () => {
    if (viewMode === "day") {
      setSelectedDate((current) => addDays(current, 1));
    } else {
      setCalendarMonth((current) => addMonths(current, 1));
    }
  };

  const handleToday = () => {
    if (viewMode === "day") {
      setSelectedDate(toDateInputValue(new Date()));
    } else {
      setCalendarMonth(toMonthStart(toDateInputValue(new Date())));
    }
  };

  const handleOpenStartSession = (appointment: Appointment) => {
    setSelectedSessionTypeId(null);
    setStartSessionAppointment(appointment);
    setSelectedAppointment(null);
  };

  const handleOpenSession = (sessionId: number) => {
    setSelectedAppointment(null);
    navigate(`/sesion/${sessionId}`);
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

  const toolbarTitle =
    viewMode === "day"
      ? isToday(selectedDate)
        ? "Hoy"
        : "Agenda"
      : "Calendario";

  const toolbarSubtitle =
    viewMode === "day"
      ? formatAppointmentDate(`${selectedDate}T00:00:00`)
      : formatMonthYear(calendarMonth);

  const showTodayButton =
    viewMode === "day"
      ? !isToday(selectedDate)
      : calendarMonth !== toMonthStart(toDateInputValue(new Date()));

  return (
    <Box>
      <AgendaToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        title={toolbarTitle}
        subtitle={toolbarSubtitle}
        showTodayButton={showTodayButton}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onToday={handleToday}
      />

      {viewMode === "day" ? (
        <>
          {dayError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              No fue posible cargar la agenda.
            </Alert>
          )}

          {dayLoading ? (
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
        </>
      ) : (
        <>
          {monthError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              No fue posible cargar el calendario.
            </Alert>
          )}

          {monthLoading ? (
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
            <CalendarMonthView
              month={calendarMonth}
              appointments={monthAppointments}
              selectedDate={selectedDate}
              onSelectDay={handleSelectDay}
            />
          )}
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
        onOpenSession={handleOpenSession}
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
