import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import type { Sesion } from "../types/session.types";
import type { SessionPsychologicalTest } from "../types/sessionPsychologicalTest.types";
import type { PsychologicalTest } from "../../catalog/types/psychologicalTest.types";

import SessionPsychologicalTestSelectionDialog from "./SessionPsychologicalTestSelectionDialog";
import SessionPsychologicalTestApplicationDialog from "./SessionPsychologicalTestApplicationDialog";

import {
  useSessionPsychologicalTests,
  usePsychologicalTests,
} from "../hooks/useSessionPsychologicalTests";

interface SessionPsychologicalTestsProps {
  session: Sesion;
}

function isActiveStatus(status?: string | null): boolean {
  if (!status) {
    return false;
  }

  const normalized = status.trim().toUpperCase();

  return normalized === "ACTIVE" || normalized === "ACTIVO";
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
}: SessionPsychologicalTestsProps) {
  const [editApplication, setEditingApplication] =
    useState<SessionPsychologicalTest | null>(null);
  const [selectionOpen, setSelectionOpen] = useState(false);
  const [applicationOpen, setApplicationOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<PsychologicalTest | null>(
    null,
  );

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

  const testCatalog = useMemo<PsychologicalTest[]>(
    () => psychologicalTests,
    [psychologicalTests],
  );

  const testById = useMemo(() => {
    const map = new Map<number, PsychologicalTest>();

    testCatalog.forEach((test) => {
      map.set(test.id, test);
    });

    return map;
  }, [testCatalog]);

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

  const isLoading = isLoadingApplications || isLoadingTests;

  const handleOpenSelection = () => {
    setSelectionOpen(true);
  };

  const handleCloseSelection = () => {
    setSelectionOpen(false);
  };

  const handleTestSelected = (test: PsychologicalTest) => {
    setEditingApplication(null);
    setSelectedTest(test);
    setSelectionOpen(false);
    setApplicationOpen(true);
  };

  const handleApplicationClose = () => {
    setApplicationOpen(false);
    setSelectedTest(null);
    setEditingApplication(null);
  };

  const handleEditApplication = (application: SessionPsychologicalTest) => {
    const test = testById.get(application.pruebaPsicologicaId);

    if (!test) {
      return;
    }

    setEditingApplication(application);
    setSelectedTest(test);
    setApplicationOpen(true);
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
            <Stack direction="row" spacing={1.25} alignItems="center">
              <AssignmentOutlinedIcon color="primary" />

              <Typography variant="h5" fontWeight={700}>
                Pruebas psicológicas
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.75 }}
            >
              Pruebas aplicadas durante la sesión y su información clínica.
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddOutlinedIcon />}
            onClick={handleOpenSelection}
            disabled={isLoading}
          >
            Aplicar prueba
          </Button>
        </Box>

        {isApplicationsError && (
          <Alert severity="error">
            No fue posible cargar las pruebas psicológicas de esta sesión.
          </Alert>
        )}

        {isTestsError && (
          <Alert severity="warning">
            No fue posible cargar la información del catálogo de pruebas.
            Algunas pruebas podrían no mostrar su información descriptiva.
          </Alert>
        )}

        {isLoading ? (
          <Card variant="outlined">
            <CardContent>
              <Stack
                spacing={2}
                alignItems="center"
                justifyContent="center"
                sx={{ minHeight: 260 }}
              >
                <CircularProgress size={32} />

                <Typography variant="body2" color="text.secondary">
                  Cargando pruebas psicológicas...
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        ) : sortedApplications.length === 0 ? (
          <EmptyTestsState onApplyTest={handleOpenSelection} />
        ) : (
          <Stack spacing={2}>
            {sortedApplications.map((application) => {
              const test = testById.get(application.pruebaPsicologicaId);

              return (
                <PsychologicalTestApplicationCard
                  key={application.id}
                  application={application}
                  test={test}
                  onEdit={handleEditApplication}
                />
              );
            })}
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
          editApplication
            ? `edit-${editApplication.id}`
            : `create-${selectedTest?.id ?? "new"}`
        }
        open={applicationOpen}
        session={session}
        test={selectedTest}
        application={editApplication}
        onClose={handleApplicationClose}
      />
    </>
  );
}

interface EmptyTestsStateProps {
  onApplyTest: () => void;
}

function EmptyTestsState({ onApplyTest }: EmptyTestsStateProps) {
  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack
          spacing={2}
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          sx={{
            minHeight: 300,
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
            <Typography variant="h6" fontWeight={700}>
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
              Todavía no se ha aplicado ninguna prueba psicológica durante esta
              sesión.
            </Typography>
          </Box>

          <Button
            variant="outlined"
            startIcon={<AddOutlinedIcon />}
            onClick={onApplyTest}
          >
            Aplicar primera prueba
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

interface PsychologicalTestApplicationCardProps {
  application: SessionPsychologicalTest;
  test?: PsychologicalTest;
  onEdit: (application: SessionPsychologicalTest) => void;
}

function PsychologicalTestApplicationCard({
  application,
  test,
  onEdit,
}: PsychologicalTestApplicationCardProps) {
  const hasInterpretation = Boolean(application.interpretacion?.trim());

  return (
    <Card
      variant="outlined"
      sx={{
        borderRadius: 2,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box
            sx={{
              display: "flex",
              flexDirection: {
                xs: "column",
                sm: "row",
              },
              justifyContent: "space-between",
              alignItems: {
                xs: "flex-start",
                sm: "center",
              },
              gap: 1.5,
            }}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "primary.50",
                  color: "primary.main",
                  flexShrink: 0,
                }}
              >
                <PsychologyOutlinedIcon />
              </Box>

              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {test?.nombre ?? "Prueba psicológica"}
                </Typography>

                {!test && (
                  <Typography variant="caption" color="text.secondary">
                    Prueba #{application.pruebaPsicologicaId}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Chip
              label={application.estado || "Activa"}
              size="small"
              color={isActiveStatus(application.estado) ? "success" : "default"}
              variant="outlined"
            />
          </Box>

          <Divider />

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={{
              xs: 1,
              sm: 3,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center">
              <CalendarTodayOutlinedIcon fontSize="small" color="action" />

              <Typography variant="body2" color="text.secondary">
                Aplicación:
              </Typography>

              <Typography variant="body2" fontWeight={600}>
                {formatDate(application.fechaAplicacion)}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <DescriptionOutlinedIcon fontSize="small" color="action" />

              <Typography variant="body2" color="text.secondary">
                Interpretación:
              </Typography>

              <Typography variant="body2" fontWeight={600}>
                {hasInterpretation ? "Disponible" : "Pendiente"}
              </Typography>
            </Stack>
          </Stack>

          {test?.objetivoPrueba && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Objetivo
              </Typography>

              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {test.objetivoPrueba}
              </Typography>
            </Box>
          )}

          <Divider />

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              size="small"
              variant="outlined"
              startIcon={<EditOutlinedIcon />}
              onClick={() => onEdit(application)}
            >
              Ver / editar aplicación
            </Button>
          </Box>

          {application.archivoAdjunto && (
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
                fontWeight={700}
                sx={{
                  textTransform: "uppercase",
                  letterSpacing: 0.5,
                }}
              >
                Archivo adjunto
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  mt: 0.5,
                  wordBreak: "break-word",
                }}
              >
                {application.archivoAdjunto}
              </Typography>
            </Box>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
