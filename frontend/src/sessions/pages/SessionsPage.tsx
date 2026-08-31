import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Alert,
  Box,
  Button,
  ButtonBase,
  Chip,
  CircularProgress,
  Divider,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import OpenInNewOutlinedIcon from "@mui/icons-material/OpenInNewOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import WarningAmberOutlinedIcon from "@mui/icons-material/WarningAmberOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../shared/components/common/PageHeader";
import { useAuth } from "../../auth/hooks/useAuth";
import { useUserSessions } from "../hooks/useUserSessions";
import { usePatients } from "../../patients/hooks/usePatients";
import { useSessionNotes } from "../hooks/usePatientClinicalContext";
import { useSessionInterventions } from "../hooks/useSessionIntervention";
import { useSessionRiskEvaluations } from "../hooks/useSessionRiskEvaluation";
import {
  usePsychologicalTests,
  useSessionPsychologicalTests,
} from "../hooks/useSessionPsychologicalTests";
import type { Sesion } from "../types/session.types";
import {
  formatAppointmentDate,
  formatAppointmentTime,
} from "../../shared/utils/dateUtils";

export default function SessionsPage() {
  const { user } = useAuth();
  const { data: sessions = [], isLoading, isError } = useUserSessions(user?.id);
  const { data: patients = [] } = usePatients();

  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [patientId, setPatientId] = useState("");
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(
    null,
  );

  const filteredSessions = useMemo(() => {
    return sessions
      .filter((session) => !date || session.fechaSesion.slice(0, 10) === date)
      .filter((session) => !month || session.fechaSesion.slice(0, 7) === month)
      .filter(
        (session) => !patientId || String(session.pacienteId) === patientId,
      )
      .sort(
        (a, b) =>
          new Date(b.fechaSesion).getTime() - new Date(a.fechaSesion).getTime(),
      );
  }, [date, month, patientId, sessions]);

  const selectedSession =
    filteredSessions.find((session) => session.id === selectedSessionId) ??
    null;

  return (
    <>
      <PageHeader
        title="Sesiones"
        description="Consulte las sesiones clínicas realizadas y las acciones documentadas en cada una."
      />

      <Stack spacing={2.5}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(3, 1fr)" },
            gap: 2,
          }}
        >
          <TextField
            label="Fecha"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            label="Mes"
            type="month"
            value={month}
            onChange={(event) => setMonth(event.target.value)}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            select
            label="Paciente"
            value={patientId}
            onChange={(event) => setPatientId(event.target.value)}
          >
            <MenuItem value="">Todos los pacientes</MenuItem>
            {patients.map((patient) => (
              <MenuItem key={patient.id} value={String(patient.id)}>
                {patient.nombre} {patient.apellido}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {isError && (
          <Alert severity="error">No fue posible cargar las sesiones.</Alert>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "minmax(260px, 32%) minmax(0, 1fr)",
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
              display: "grid",
              gridTemplateRows: "auto minmax(0, 1fr)",
              minWidth: 0,
              minHeight: 0,
              overflow: "hidden",
              borderRight: { xs: 0, md: 1 },
              borderBottom: { xs: 1, md: 0 },
              borderColor: "divider",
            }}
          >
            <Box
              sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}
            >
              <Typography
                variant="overline"
                color="text.secondary"
                fontWeight={700}
              >
                Sesiones ({filteredSessions.length})
              </Typography>
            </Box>

            <Box sx={{ minHeight: 0, overflowY: "auto" }}>
              {isLoading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
                  <CircularProgress size={28} />
                </Box>
              ) : filteredSessions.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ p: 2 }}
                >
                  No hay sesiones para estos filtros.
                </Typography>
              ) : (
                <Stack spacing={0.5} sx={{ p: 1.25 }}>
                  {filteredSessions.map((session) => {
                    const selected = session.id === selectedSessionId;

                    return (
                      <ButtonBase
                        key={session.id}
                        onClick={() => setSelectedSessionId(session.id)}
                        sx={{
                          display: "block",
                          width: "100%",
                          p: 1.25,
                          borderRadius: 1.5,
                          textAlign: "left",
                          color: selected ? "primary.main" : "text.primary",
                          bgcolor: selected ? "action.selected" : "transparent",
                          "&:hover": { bgcolor: "action.hover" },
                        }}
                      >
                        <Typography
                          variant="body2"
                          fontWeight={selected ? 700 : 600}
                        >
                          {session.pacienteNombre}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {formatAppointmentDate(session.fechaSesion)} ·{" "}
                          {formatAppointmentTime(session.fechaSesion)}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {session.tipoSesion}
                        </Typography>
                      </ButtonBase>
                    );
                  })}
                </Stack>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              minWidth: 0,
              minHeight: 0,
              overflowY: "auto",
              p: { xs: 2, md: 3 },
            }}
          >
            {selectedSession ? (
              <SessionActivitiesDetail session={selectedSession} />
            ) : (
              <Stack
                alignItems="center"
                justifyContent="center"
                spacing={1}
                sx={{ height: "100%", minHeight: 320, textAlign: "center" }}
              >
                <EventNoteOutlinedIcon
                  sx={{ fontSize: 52, color: "text.disabled" }}
                />
                <Typography variant="h6" fontWeight={700}>
                  Seleccione una sesión
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Consulte las actividades registradas durante la sesión.
                </Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </Stack>
    </>
  );
}

function SessionActivitiesDetail({ session }: { session: Sesion }) {
  const navigate = useNavigate();
  const notes = useSessionNotes(session.id);
  const interventions = useSessionInterventions(session.id);
  const risks = useSessionRiskEvaluations(session.id);
  const tests = useSessionPsychologicalTests(session.id);
  const { data: testCatalog = [] } = usePsychologicalTests();

  const testNames = useMemo(
    () => new Map(testCatalog.map((test) => [test.id, test.nombre])),
    [testCatalog],
  );

  const isLoading =
    notes.isLoading ||
    interventions.isLoading ||
    risks.isLoading ||
    tests.isLoading;

  return (
    <Stack spacing={3}>
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
          <Typography variant="h5" fontWeight={700}>
            {session.pacienteNombre}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {session.tipoSesion} · {formatAppointmentDate(session.fechaSesion)}{" "}
            · {formatAppointmentTime(session.fechaSesion)}
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<OpenInNewOutlinedIcon />}
          onClick={() => navigate(`/sesion/${session.id}`)}
        >
          Ver sesión
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress size={28} />
        </Box>
      ) : (
        <Stack spacing={3}>
          <ActivitySection
            icon={<NotesOutlinedIcon fontSize="small" color="action" />}
            title="Observaciones generales"
          >
            <Typography
              variant="body2"
              sx={{ whiteSpace: "pre-wrap", lineHeight: 1.7 }}
            >
              {session.observacionesGenerales?.trim() ||
                "Sin información registrada."}
            </Typography>
          </ActivitySection>

          <Divider />

          <ActivitySection
            icon={<NotesOutlinedIcon fontSize="small" color="action" />}
            title={`Notas (${notes.data?.length ?? 0})`}
          >
            {notes.data?.length ? (
              <Stack spacing={1}>
                {notes.data.map((note) => (
                  <RecordLine
                    key={note.id}
                    title={note.tipoNota || "Nota clínica"}
                    detail={note.contenido}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyText />
            )}
          </ActivitySection>

          <ActivitySection
            icon={<PsychologyOutlinedIcon fontSize="small" color="action" />}
            title={`Pruebas psicológicas (${tests.data?.length ?? 0})`}
          >
            {tests.data?.length ? (
              <Stack spacing={1}>
                {tests.data.map((test) => (
                  <RecordLine
                    key={test.id}
                    title={
                      testNames.get(test.pruebaPsicologicaId) ??
                      "Prueba psicológica"
                    }
                    detail={test.interpretacion}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyText />
            )}
          </ActivitySection>

          <ActivitySection
            icon={<HealingOutlinedIcon fontSize="small" color="action" />}
            title={`Intervenciones (${interventions.data?.length ?? 0})`}
          >
            {interventions.data?.length ? (
              <Stack spacing={1}>
                {interventions.data.map((intervention) => (
                  <RecordLine
                    key={intervention.id}
                    title={intervention.intervencion}
                    detail={intervention.tipoIntervencion}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyText />
            )}
          </ActivitySection>

          <ActivitySection
            icon={<WarningAmberOutlinedIcon fontSize="small" color="action" />}
            title={`Evaluaciones de riesgo (${risks.data?.length ?? 0})`}
          >
            {risks.data?.length ? (
              <Stack spacing={1}>
                {risks.data.map((risk) => (
                  <RecordLine
                    key={risk.id}
                    title={risk.tipoRiesgo || "Evaluación de riesgo"}
                    detail={risk.observaciones}
                    chip={risk.nivelRiesgo}
                  />
                ))}
              </Stack>
            ) : (
              <EmptyText />
            )}
          </ActivitySection>
        </Stack>
      )}
    </Stack>
  );
}

function ActivitySection({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <Box>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
        {icon}
        <Typography variant="subtitle2" fontWeight={700}>
          {title}
        </Typography>
      </Stack>
      {children}
    </Box>
  );
}

function RecordLine({
  title,
  detail,
  chip,
}: {
  title: string;
  detail?: string | null;
  chip?: string | null;
}) {
  return (
    <Box sx={{ p: 1.5, border: 1, borderColor: "divider", borderRadius: 1.5 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        gap={1}
      >
        <Typography variant="body2" fontWeight={700}>
          {title}
        </Typography>
        {chip && <Chip label={chip} size="small" />}
      </Stack>
      {detail?.trim() && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ mt: 0.5, whiteSpace: "pre-wrap" }}
        >
          {detail}
        </Typography>
      )}
    </Box>
  );
}

function EmptyText() {
  return (
    <Typography variant="body2" color="text.secondary">
      Sin registros.
    </Typography>
  );
}
