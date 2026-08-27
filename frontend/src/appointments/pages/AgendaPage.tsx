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
import { getPatientSessions } from "../../sessions/api/sessionContextApi";
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

  const handleOpenStartSession = async (appointment: Appointment) => {
    setSelectedAppointment(null);

    const previousSessions = await getPatientSessions(appointment.pacienteId);

    const hasPreviousSessionWithUser = previousSessions.some(
      (previousSession) => previousSession.usuarioId === appointment.usuarioId,
    );

    const request: SessionRequest = {
      pacienteId: appointment.pacienteId,
      usuarioId: appointment.usuarioId,
      tipoSesionId: hasPreviousSessionWithUser ? 2 : 1,
      fechaSesion: toLocalDateTimeString(new Date()),
      citaId: appointment.id,
    };

    startSessionMutation.mutate(request, {
      onSuccess: (session) => {
        navigate(`/sesion/${session.id}`);
      },
    });
  };

  const handleOpenSession = (sessionId: number) => {
    setSelectedAppointment(null);
    navigate(`/sesion/${sessionId}`);
  };

  const handleEmptySlotClick = (time: string) => {
    setAppointmentInitialStartTime(time);
    setAppointmentDialogKey((current) => current + 1);
    setAppointmentDialogOpen(true);
  };

  const [appointmentDialogKey, setAppointmentDialogKey] = useState(0);

  const startSessionMutation = useStartSession();

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
                appointments={agendaAppointments}
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
    </Box>
  );
}
