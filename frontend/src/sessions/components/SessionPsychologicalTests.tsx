import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import type { Sesion } from "../types/session.types";
import type { SessionPsychologicalTest } from "../types/sessionPsychologicalTest.types";
import type { PsychologicalTest } from "../../catalog/types/psychologicalTest.types";
import type { ClinicalContextPsychologicalTest } from "../types/clinicalSessionContext.types";

import SessionPsychologicalTestSelectionDialog from "./SessionPsychologicalTestSelectionDialog";
import SessionPsychologicalTestApplicationDialog from "./SessionPsychologicalTestApplicationDialog";

import {
  usePsychologicalTests,
  useSessionPsychologicalTests,
} from "../hooks/useSessionPsychologicalTests";
import { useClinicalSessionContext } from "../hooks/usePatientClinicalContext";

interface SessionPsychologicalTestsProps {
  session: Sesion;
  allowCreate?: boolean;
}

function formatDate(date?: string | null): string {
  if (!date) {
    return "Sin fecha";
  }

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("es-GT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(parsedDate);
}

export default function SessionPsychologicalTests({
  session,
  allowCreate = true,
}: SessionPsychologicalTestsProps) {
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);

  const [selectedTest, setSelectedTest] =
    useState<PsychologicalTest | null>(null);

  const [editingApplication, setEditingApplication] =
    useState<SessionPsychologicalTest | null>(null);

  const {
    data: applications = [],
    isLoading: isLoadingApplications,
    isError: isApplicationsError,
  } = useSessionPsychologicalTests(session.id);

  const {
    data: psychologicalTests = [],
    isLoading: isLoadingTests,
    isError: isTestsError,
  } = usePsychologicalTests();

  const { data: clinicalContext, isLoading: isLoadingHistory } =
    useClinicalSessionContext(session.id);

  const testById = useMemo(() => {
    const map = new Map<number, PsychologicalTest>();

    psychologicalTests.forEach((test) => {
      map.set(test.id, test);
    });

    return map;
  }, [psychologicalTests]);

  const sortedApplications = useMemo(
    () =>
      [...applications].sort((a, b) => {
        const dateComparison = b.fechaAplicacion.localeCompare(
          a.fechaAplicacion,
        );

        if (dateComparison !== 0) {
          return dateComparison;
        }

        return b.id - a.id;
      }),
    [applications],
  );

  const isLoading =
    isLoadingApplications || isLoadingTests || isLoadingHistory;

  const historicalApplications = useMemo(() => {
    const sessions = new Map(
      clinicalContext?.recentSessions.items.map((item) => [item.id, item]) ?? [],
    );

    if (clinicalContext?.currentSession) {
      sessions.set(clinicalContext.currentSession.id, clinicalContext.currentSession);
    }

    return (clinicalContext?.psychologicalTests.items ?? [])
      .filter((application) => application.sesionId !== session.id)
      .sort((a, b) => {
        const dateComparison = b.fechaAplicacion.localeCompare(a.fechaAplicacion);

        if (dateComparison !== 0) {
          return dateComparison;
        }

        return b.id - a.id;
      })
      .map((application) => ({
        application,
        encounter: application.sesionId ? sessions.get(application.sesionId) : undefined,
      }));
  }, [clinicalContext, session.id]);

  const hasApplications = historicalApplications.length > 0 || sortedApplications.length > 0;

  const handleOpenSelection = () => {
    setEditingApplication(null);
    setSelectedTest(null);
    setSelectionOpen(true);
  };

  const handleCloseSelection = () => {
    setSelectionOpen(false);
  };

  const handleTestSelected = (
    test: PsychologicalTest,
  ) => {
    setSelectionOpen(false);
    setSelectedTest(test);
    setEditingApplication(null);
    setApplicationOpen(true);
  };

  const handleEditApplication = (
    application: SessionPsychologicalTest,
  ) => {
    const test = testById.get(
      application.pruebaPsicologicaId,
    );

    if (!test) {
      return;
    }

    setEditingApplication(application);
    setSelectedTest(test);
    setApplicationOpen(true);
  };

  const handleCloseApplication = () => {
    setApplicationOpen(false);
    setSelectedTest(null);
    setEditingApplication(null);
  };

  return (
    <>
      <Stack spacing={3}>
        <Box
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: {
              xs: "stretch",
              sm: "center",
            },
            gap: 2,
          }}
        >
          <Box>
            <Stack
              direction="row"
              spacing={1.25}
              alignItems="center"
            >
              <AssignmentOutlinedIcon color="primary" />

              <Typography
                variant="h5"
                fontWeight={700}
              >
                Pruebas psicológicas
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Pruebas aplicadas durante esta sesión y su
              información clínica.
            </Typography>
          </Box>

          {allowCreate && (
            <Button
              variant="contained"
              startIcon={<AddOutlinedIcon />}
              onClick={handleOpenSelection}
              disabled={isLoading}
            >
              Aplicar prueba
            </Button>
          )}
        </Box>

        {isApplicationsError && (
          <Alert severity="error">
            No fue posible cargar las pruebas psicológicas de
            esta sesión.
          </Alert>
        )}

        {isTestsError && (
          <Alert severity="warning">
            No fue posible cargar la información del catálogo
            de pruebas.
          </Alert>
        )}

        {isLoading ? (
          <Card variant="outlined">
            <CardContent>
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: 240 }}
              >
                <CircularProgress size={32} />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Cargando pruebas psicológicas...
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : !hasApplications ? (
          <EmptyTestsState
            onApplyTest={allowCreate ? handleOpenSelection : undefined}
          />
        ) : (
          <Stack spacing={3}>
            <TestHistorySection
              applications={[
                ...historicalApplications,
                ...sortedApplications.map((application) => ({
                  application: {
                    id: application.id,
                    pruebaPsicologicaId: application.pruebaPsicologicaId,
                    pruebaNombre: testById.get(application.pruebaPsicologicaId)?.nombre ?? null,
                    fechaAplicacion: application.fechaAplicacion,
                    sesionId: application.sesionId,
                  },
                  encounter: undefined,
                  currentApplication: application,
                })),
              ].sort((a, b) =>
                b.application.fechaAplicacion.localeCompare(
                  a.application.fechaAplicacion,
                ),
              )}
              testById={testById}
              onEdit={handleEditApplication}
            />
          </Stack>
        )}
      </Stack>

      <SessionPsychologicalTestSelectionDialog
        open={selectionOpen}
        session={session}
        onClose={handleCloseSelection}
        onSelect={handleTestSelected}
      />

      <SessionPsychologicalTestApplicationDialog
        key={
          editingApplication
            ? `edit-${editingApplication.id}`
            : `create-${selectedTest?.id ?? "new"}`
        }
        open={applicationOpen}
        session={session}
        test={selectedTest}
        application={editingApplication}
        onClose={handleCloseApplication}
      />
    </>
  );
}

interface EmptyTestsStateProps {
  onApplyTest?: () => void;
}

interface TestHistoryItem {
  application: ClinicalContextPsychologicalTest;
  encounter?: { fechaSesion: string; tipoSesion: string | null };
  currentApplication?: SessionPsychologicalTest;
}

interface TestHistorySectionProps {
  applications: TestHistoryItem[];
  testById: Map<number, PsychologicalTest>;
  onEdit?: (application: SessionPsychologicalTest) => void;
}

function TestHistorySection({
  applications,
  testById,
  onEdit,
}: TestHistorySectionProps) {
  return (
    <Box>
      <Stack divider={<Divider flexItem />} spacing={0}>
        {applications.map((item) => {
          const test = item.application.pruebaPsicologicaId
            ? testById.get(item.application.pruebaPsicologicaId)
            : undefined;

          return (
            <PsychologicalTestHistoryRow
              key={item.application.id}
              item={item}
              testName={test?.nombre ?? item.application.pruebaNombre ?? "Prueba psicológica"}
              onEdit={onEdit}
            />
          );
        })}
      </Stack>
    </Box>
  );
}

function PsychologicalTestHistoryRow({
  item,
  testName,
  onEdit,
}: {
  item: TestHistoryItem;
  testName: string;
  onEdit?: (application: SessionPsychologicalTest) => void;
}) {
  return (
    <Box sx={{ py: 1.5 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start" }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body1" fontWeight={700}>{testName}</Typography>
          <Typography variant="body2" color="text.secondary">
            {formatDate(item.application.fechaAplicacion)}
            {item.encounter?.tipoSesion ? ` · ${item.encounter.tipoSesion}` : ""}
          </Typography>
        </Box>
        {item.currentApplication && onEdit && (
          <Button size="small" variant="text" startIcon={<EditOutlinedIcon />} onClick={() => onEdit(item.currentApplication!)}>
            Editar
          </Button>
        )}
      </Box>
      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
        {item.currentApplication?.interpretacion?.trim() ? "Interpretación disponible" : "Aplicación registrada"}
      </Typography>
    </Box>
  );
}

function EmptyTestsState({
  onApplyTest,
}: EmptyTestsStateProps) {
  return (
    <Box sx={{ py: 1.5, borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          sx={{
            minHeight: 280,
            px: 2,
          }}
        >
          <AssignmentOutlinedIcon
            sx={{
              fontSize: 52,
              color: "text.disabled",
            }}
          />

          <Box>
            <Typography
              variant="h6"
              fontWeight={700}
            >
              No hay pruebas aplicadas
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mt: 0.75,
                maxWidth: 480,
              }}
            >
              Todavía no se ha registrado ninguna prueba
              psicológica durante esta sesión.
            </Typography>
          </Box>

          {onApplyTest && (
            <Button
              variant="outlined"
              startIcon={<AddOutlinedIcon />}
              onClick={onApplyTest}
            >
              Aplicar primera prueba
            </Button>
          )}
        </Stack>
    </Box>
  );
}
