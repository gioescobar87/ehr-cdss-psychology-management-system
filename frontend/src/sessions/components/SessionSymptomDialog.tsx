import { useMemo, useState } from "react";
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Checkbox,
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
import CheckBoxOutlineBlankOutlinedIcon from "@mui/icons-material/CheckBoxOutlineBlankOutlined";
import CheckBoxOutlinedIcon from "@mui/icons-material/CheckBoxOutlined";
import type {
  ClinicalCriterion,
  SessionSymptom,
} from "../types/sessionSymptom.types";
import { useCreateSessionSymptomsBatch } from "../hooks/useSessionSymptoms";
import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionSymptomDialogProps {
  open: boolean;
  sessionId: number;
  criteria: ClinicalCriterion[];
  existingSymptoms: SessionSymptom[];
  onClose: () => void;
}

const EMPTY_CATEGORY = "Sin categoría";

export default function SessionSymptomDialog({
  open,
  sessionId,
  criteria,
  existingSymptoms,
  onClose,
}: SessionSymptomDialogProps) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const mutation = useCreateSessionSymptomsBatch();
  const { showSuccess } = useNotification();

  const assignedIds = useMemo(
    () =>
      new Set(
        existingSymptoms
          .filter((symptom) => symptom.sesionId === sessionId)
          .filter((symptom) => symptom.presente)
          .map((symptom) => symptom.criterioClinicoId),
      ),
    [existingSymptoms, sessionId],
  );

  const availableCriteria = useMemo(
    () =>
      criteria.filter((criterion) => {
        const status = criterion.estado.trim().toUpperCase();
        return (
          (status === "ACTIVO" || status === "ACTIVE") &&
          !assignedIds.has(criterion.id)
        );
      }),
    [assignedIds, criteria],
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          availableCriteria.map(
            (criterion) => criterion.categoriaCriterioClinico || EMPTY_CATEGORY,
          ),
        ),
      ).sort((a, b) => a.localeCompare(b)),
    [availableCriteria],
  );

  const filteredCriteria = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return availableCriteria.filter((criterion) => {
      const category = criterion.categoriaCriterioClinico || EMPTY_CATEGORY;
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(category);
      const searchableText = [
        criterion.codigo,
        criterion.nombre,
        criterion.descripcion,
        category,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return matchesCategory && searchableText.includes(normalizedSearch);
    });
  }, [availableCriteria, search, selectedCategories]);

  const toggleSelection = (id: number) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id],
    );
  };

  const handleClose = () => {
    if (mutation.isPending) return;
    setSearch("");
    setSelectedCategories([]);
    setSelectedIds([]);
    onClose();
  };

  const handleSave = () => {
    if (selectedIds.length === 0 || mutation.isPending) return;
    mutation.mutate(
      { sesionId: sessionId, criterioClinicoIds: selectedIds },
      {
        onSuccess: (saved) => {
          showSuccess(
            saved.length === 1
              ? "El síntoma fue registrado correctamente."
              : "Los síntomas fueron registrados correctamente.",
          );
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
      <DialogTitle>Seleccionar síntomas</DialogTitle>
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
            label="Buscar síntomas"
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

        <Box
          sx={{
            px: 2,
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            {filteredCriteria.length} criterios disponibles
          </Typography>
          <Typography
            variant="body2"
            color={selectedIds.length ? "primary.main" : "text.secondary"}
            fontWeight={selectedIds.length ? 700 : 400}
          >
            {selectedIds.length} seleccionados
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
            aria-label="Criterios clínicos disponibles"
          >
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox" />
                <TableCell>Categoría</TableCell>
                <TableCell>Código</TableCell>
                <TableCell>Síntoma</TableCell>
                <TableCell>Descripción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCriteria.map((criterion) => {
                const selected = selectedIds.includes(criterion.id);
                return (
                  <TableRow
                    hover
                    key={criterion.id}
                    selected={selected}
                    onClick={() => toggleSelection(criterion.id)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={selected}
                        onChange={() => toggleSelection(criterion.id)}
                        onClick={(event) => event.stopPropagation()}
                        disabled={mutation.isPending}
                        icon={<CheckBoxOutlineBlankOutlinedIcon />}
                        checkedIcon={<CheckBoxOutlinedIcon />}
                        inputProps={{
                          "aria-label": `Seleccionar ${criterion.nombre}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {criterion.categoriaCriterioClinico || EMPTY_CATEGORY}
                    </TableCell>
                    <TableCell>{criterion.codigo}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>
                      {criterion.nombre}
                    </TableCell>
                    <TableCell sx={{ color: "text.secondary" }}>
                      {criterion.descripcion || "Sin descripción"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filteredCriteria.length === 0 && (
            <Box sx={{ py: 8, px: 3, textAlign: "center" }}>
              <Typography fontWeight={600}>
                No hay síntomas disponibles
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
          Los síntomas seleccionados se asociarán a esta sesión.
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={handleClose} disabled={mutation.isPending}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={selectedIds.length === 0 || mutation.isPending}
          >
            {mutation.isPending
              ? "Guardando..."
              : `Guardar${selectedIds.length ? ` (${selectedIds.length})` : ""}`}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
