import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import type { Sesion } from "../types/session.types";
import type { PsychologicalTest } from "../../catalog/types/psychologicalTest.types";

import { usePsychologicalTests } from "../hooks/useSessionPsychologicalTests";

interface SessionPsychologicalTestSelectionDialogProps {
  open: boolean;
  session: Sesion;
  onClose: () => void;
  onSelect: (test: PsychologicalTest) => void;
}

function isActiveStatus(status?: string | null): boolean {
  if (!status) {
    return false;
  }

  const normalized = status.trim().toUpperCase();

  return normalized === "ACTIVE" || normalized === "ACTIVO";
}

export default function SessionPsychologicalTestSelectionDialog({
  open,
  session,
  onClose,
  onSelect,
}: SessionPsychologicalTestSelectionDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

  const { data: tests = [], isLoading, isError } = usePsychologicalTests(open);

  const availableTests = useMemo(
    () => tests.filter((test) => isActiveStatus(test.estado)),
    [tests],
  );

  const filteredTests = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return availableTests;
    }

    return availableTests.filter((test) => {
      const searchableContent = [
        test.nombre,
        test.descripcion,
        test.objetivoPrueba,
        test.instruccionesAplicacion,
        test.consideraciones,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableContent.includes(normalizedSearch);
    });
  }, [availableTests, search]);

  const selectedTest = useMemo(
    () => availableTests.find((test) => test.id === selectedTestId) ?? null,
    [availableTests, selectedTestId],
  );

  const handleClose = () => {
    setSearch("");
    setSelectedTestId(null);
    onClose();
  };

  const handleSelect = (test: PsychologicalTest) => {
    setSelectedTestId(test.id);
  };

  const handleContinue = () => {
    if (!selectedTest) {
      return;
    }

    onSelect(selectedTest);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: {
          minHeight: {
            xs: "auto",
            md: 650,
          },
        },
      }}
    >
      <DialogTitle>
        <Stack spacing={0.5}>
          <Typography variant="h6" fontWeight={700}>
            Seleccionar prueba psicológica
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Seleccione la prueba que mejor se adapte a las necesidades clínicas
            del paciente.
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 0 }}>
        {isError ? (
          <Box sx={{ p: 3 }}>
            <Alert severity="error">
              No fue posible cargar las pruebas psicológicas disponibles.
            </Alert>
          </Box>
        ) : isLoading ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={2}
            sx={{
              minHeight: 420,
              p: 3,
            }}
          >
            <CircularProgress />

            <Typography variant="body2" color="text.secondary">
              Cargando pruebas psicológicas...
            </Typography>
          </Stack>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "minmax(280px, 0.9fr) minmax(400px, 1.5fr)",
              },
              minHeight: 500,
            }}
          >
            {/* Catalog / Search */}
            <Box
              sx={{
                borderRight: {
                  xs: "none",
                  md: 1,
                },
                borderBottom: {
                  xs: 1,
                  md: "none",
                },
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                minWidth: 0,
              }}
            >
              <Box sx={{ p: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar prueba..."
                  label="Buscar"
                  autoComplete="off"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    display: "block",
                    mt: 1,
                  }}
                >
                  {filteredTests.length}{" "}
                  {filteredTests.length === 1
                    ? "prueba disponible"
                    : "pruebas disponibles"}
                </Typography>
              </Box>

              <Divider />

              {filteredTests.length === 0 ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                  sx={{
                    flex: 1,
                    p: 3,
                    textAlign: "center",
                  }}
                >
                  <SearchOutlinedIcon
                    sx={{
                      fontSize: 40,
                      color: "text.disabled",
                    }}
                  />

                  <Typography variant="subtitle2">
                    No se encontraron pruebas
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Intente con otro término de búsqueda.
                  </Typography>
                </Stack>
              ) : (
                <List
                  disablePadding
                  sx={{
                    overflowY: "auto",
                    flex: 1,
                  }}
                >
                  {filteredTests.map((test) => {
                    const isSelected = test.id === selectedTestId;

                    return (
                      <ListItemButton
                        key={test.id}
                        selected={isSelected}
                        onClick={() => handleSelect(test)}
                        sx={{
                          px: 2,
                          py: 1.5,
                          alignItems: "flex-start",
                          borderBottom: 1,
                          borderColor: "divider",
                        }}
                      >
                        <PsychologyOutlinedIcon
                          sx={{
                            mr: 1.5,
                            mt: 0.25,
                            color: isSelected
                              ? "primary.main"
                              : "text.secondary",
                          }}
                          fontSize="small"
                        />

                        <ListItemText
                          primary={
                            <Typography
                              variant="body2"
                              fontWeight={isSelected ? 700 : 500}
                            >
                              {test.nombre}
                            </Typography>
                          }
                          secondary={test.descripcion || "Sin descripción."}
                          secondaryTypographyProps={{
                            variant: "caption",
                            sx: {
                              mt: 0.5,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            },
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              )}
            </Box>

            {/* Test information */}
            <Box
              sx={{
                p: {
                  xs: 2,
                  md: 3,
                },
                minWidth: 0,
                overflowY: "auto",
              }}
            >
              {!selectedTest ? (
                <Stack
                  alignItems="center"
                  justifyContent="center"
                  spacing={1.5}
                  sx={{
                    height: "100%",
                    minHeight: 400,
                    textAlign: "center",
                    maxWidth: 480,
                    mx: "auto",
                  }}
                >
                  <PsychologyOutlinedIcon
                    sx={{
                      fontSize: 52,
                      color: "text.disabled",
                    }}
                  />

                  <Typography variant="h6" fontWeight={700}>
                    Seleccione una prueba
                  </Typography>

                  <Typography variant="body2" color="text.secondary">
                    Seleccione una prueba del catálogo para consultar su
                    información clínica antes de aplicarla.
                  </Typography>
                </Stack>
              ) : (
                <Stack spacing={3}>
                  <Stack direction="row" spacing={1.5} alignItems="flex-start">
                    <PsychologyOutlinedIcon
                      sx={{
                        color: "primary.main",
                        fontSize: 30,
                        mt: 0.25,
                      }}
                    />

                    <Box sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="h6"
                        fontWeight={700}
                        sx={{
                          overflowWrap: "anywhere",
                        }}
                      >
                        {selectedTest.nombre}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        Información de la prueba
                      </Typography>
                    </Box>

                    <CheckCircleOutlineOutlinedIcon color="primary" />
                  </Stack>

                  <Divider />

                  <TestInformationSection
                    title="Objetivo de la prueba"
                    value={selectedTest.objetivoPrueba}
                  />

                  <TestInformationSection
                    title="Descripción"
                    value={selectedTest.descripcion}
                  />

                  <TestInformationSection
                    title="Instrucciones de aplicación"
                    value={selectedTest.instruccionesAplicacion}
                  />

                  <TestInformationSection
                    title="Consideraciones"
                    value={selectedTest.consideraciones}
                  />

                  <Alert severity="info">
                    <Typography variant="body2">
                      Paciente: <strong>{session.pacienteNombre}</strong>
                    </Typography>
                  </Alert>
                </Stack>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
        }}
      >
        <Button onClick={handleClose}>Cancelar</Button>

        <Button
          variant="contained"
          onClick={handleContinue}
          disabled={!selectedTest}
        >
          Continuar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

interface TestInformationSectionProps {
  title: string;
  value?: string | null;
}

function TestInformationSection({ title, value }: TestInformationSectionProps) {
  if (!value?.trim()) {
    return null;
  }

  return (
    <Stack spacing={0.75}>
      <Typography variant="subtitle2" fontWeight={700} color="text.primary">
        {title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          whiteSpace: "pre-line",
          lineHeight: 1.7,
        }}
      >
        {value}
      </Typography>
    </Stack>
  );
}
