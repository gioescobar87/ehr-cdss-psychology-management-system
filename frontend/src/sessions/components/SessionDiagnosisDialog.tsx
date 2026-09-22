import { useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

import { useCreatePatientDiagnosis } from "../hooks/useSessionDiagnoses";
import type {
  PatientDiagnosis,
  Response as CatalogDiagnosis,
} from "../types/sessionDiagnosis.types";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionDiagnosisDialogProps {
  open: boolean;
  sessionId: number;
  diagnoses: CatalogDiagnosis[];
  existingDiagnoses: PatientDiagnosis[];
  onClose: () => void;
}

const isActive = (value?: string | null) =>
  value?.trim().toUpperCase() === "ACTIVO" ||
  value?.trim().toUpperCase() === "ACTIVE";

export default function SessionDiagnosisDialog({
  open,
  sessionId,
  diagnoses,
  existingDiagnoses,
  onClose,
}: SessionDiagnosisDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const mutation = useCreatePatientDiagnosis();
  const { showSuccess } = useNotification();

  const assignedIds = useMemo(
    () =>
      new Set(
        existingDiagnoses
          .filter((diagnosis) => diagnosis.sesionId === sessionId)
          .map((diagnosis) => diagnosis.diagnosticoId),
      ),
    [existingDiagnoses, sessionId],
  );
  const availableDiagnoses = useMemo(
    () =>
      diagnoses.filter(
        (diagnosis) =>
          isActive(diagnosis.estado) && !assignedIds.has(diagnosis.id),
      ),
    [assignedIds, diagnoses],
  );
  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          availableDiagnoses.map((diagnosis) => diagnosis.categoriaDiagnostica),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [availableDiagnoses],
  );
  const filteredDiagnoses = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return availableDiagnoses.filter((diagnosis) => {
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(diagnosis.categoriaDiagnostica);
      const searchableText = [
        diagnosis.codigoIcd,
        diagnosis.nombre,
        diagnosis.descripcion,
        diagnosis.categoriaDiagnostica,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && searchableText.includes(normalizedSearch);
    });
  }, [availableDiagnoses, search, selectedCategories]);
  const handleClose = () => {
    if (mutation.isPending) return;
    setSearch("");
    setSelectedCategories([]);
    setSelectedId(null);
    onClose();
  };

  const handleSave = () => {
    if (selectedId === null || mutation.isPending) return;
    mutation.mutate(
      {
        sesionId: sessionId,
        diagnosticoId: selectedId,
        diagnosticoInicial: false,
      },
      {
        onSuccess: () => {
          showSuccess("El diagnóstico fue registrado correctamente.");
          handleClose();
        },
      },
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        sx: { height: { xs: "92vh", md: 720 }, maxHeight: "92vh" },
      }}
    >
      <DialogTitle>Diagnosticar</DialogTitle>
      <DialogContent
        dividers
        sx={{ p: 0, display: "flex", flexDirection: "column" }}
      >
        <Box
          sx={{
            p: 2,
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <TextField
            size="small"
            label="Buscar diagnósticos"
            placeholder="Código, nombre o descripción"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            sx={{ minWidth: { xs: "100%", sm: 320 }, flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Autocomplete
            multiple
            size="small"
            options={categories}
            value={selectedCategories}
            onChange={(_, values) => setSelectedCategories(values)}
            disableCloseOnSelect
            sx={{ minWidth: { xs: "100%", sm: 300 }, flex: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Filtrar por categoría"
                placeholder="Categorías"
              />
            )}
          />
        </Box>
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="body2" color="text.secondary">
            {filteredDiagnoses.length} diagnósticos disponibles
          </Typography>
        </Box>
        {mutation.error && (
          <Alert severity="error" sx={{ mx: 2, mb: 1 }}>
            {getApiErrorMessage(mutation.error)}
          </Alert>
        )}
        <TableContainer sx={{ flex: 1, overflowY: "auto" }}>
          <Table
            stickyHeader
            size="small"
            aria-label="Diagnósticos disponibles"
          >
            <TableHead>
              <TableRow>
                <TableCell>Código DSM</TableCell>
                <TableCell>Diagnóstico</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDiagnoses.map((diagnosis) => {
                const selected = selectedId === diagnosis.id;
                return (
                  <TableRow
                    hover
                    key={diagnosis.id}
                    selected={selected}
                    onClick={() =>
                      setSelectedId(selected ? null : diagnosis.id)
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{diagnosis.codigoIcd}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {diagnosis.nombre}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {diagnosis.descripcion || "Sin descripción"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredDiagnoses.length === 0 && (
            <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
              <Typography fontWeight={600}>
                No hay diagnósticos disponibles
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                Ajuste la búsqueda o los filtros de categoría.
              </Typography>
            </Box>
          )}
        </TableContainer>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, justifyContent: "space-between" }}>
        <Typography variant="body2" color="text.secondary">
          El diagnóstico seleccionado se asociará a esta sesión.
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={handleClose} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={selectedId === null || mutation.isPending}
          >
            {mutation.isPending ? "Guardando..." : "Guardar"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
