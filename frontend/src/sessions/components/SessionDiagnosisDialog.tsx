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
  FormControl,
  FormControlLabel,
  FormLabel,
  InputAdornment,
  Radio,
  RadioGroup,
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

import {
  useFinalizeSessionInference,
  usePrepareSessionInference,
} from "../hooks/useSessionDiagnoses";
import type {
  FinalizeInferenceResponse,
  InferencePreparation,
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
  const [preparation, setPreparation] = useState<InferencePreparation | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<number, 0 | 1>>({});
  const [finalResult, setFinalResult] =
    useState<FinalizeInferenceResponse | null>(null);
  const preparationMutation = usePrepareSessionInference();
  const finalizeMutation = useFinalizeSessionInference();
  const { showSuccess } = useNotification();
  const isPending = preparationMutation.isPending || finalizeMutation.isPending;

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
    if (isPending) return;
    setSearch("");
    setSelectedCategories([]);
    setSelectedId(null);
    setPreparation(null);
    setAnswers({});
    setFinalResult(null);
    onClose();
  };

  const submitFinal = (
    candidatePreparation: InferencePreparation,
    currentAnswers: Record<number, 0 | 1>,
  ) => {
    if (selectedId === null) return;
    finalizeMutation.mutate(
      {
        sessionId,
        request: {
          diagnosticoSeleccionadoId: selectedId,
          diagnosticoInicial: false,
          answers: candidatePreparation.questions.flatMap((question) =>
            question.ruleIds.map((ruleId) => ({
              ruleId,
              value: currentAnswers[ruleId],
            })),
          ),
        },
      },
      {
        onSuccess: (result) => {
          if (!result.complete) {
            setPreparation((current) => {
              if (!current) return current;
              const mergedQuestions = new Map(
                current.questions.map((question) => [question.question, question]),
              );
              for (const question of result.questions) {
                const existing = mergedQuestions.get(question.question);
                mergedQuestions.set(
                  question.question,
                  existing
                    ? {
                        ...existing,
                        ruleIds: Array.from(
                          new Set([...existing.ruleIds, ...question.ruleIds]),
                        ),
                        diagnosisIds: Array.from(
                          new Set([
                            ...existing.diagnosisIds,
                            ...question.diagnosisIds,
                          ]),
                        ),
                      }
                    : question,
                );
              }
              return {
                candidates: result.candidates,
                questions: Array.from(mergedQuestions.values()),
              };
            });
            return;
          }
          setFinalResult(result);
          showSuccess("El diagnóstico fue registrado correctamente.");
        },
      },
    );
  };

  const hasAllAnswers =
    preparation !== null &&
    preparation.questions.every((question) =>
      question.ruleIds.every((ruleId) => answers[ruleId] !== undefined),
    );

  const handleSave = () => {
    if (selectedId === null || isPending || finalResult) return;
    if (!preparation) {
      preparationMutation.mutate(
        { sessionId, diagnosticoSeleccionadoId: selectedId },
        {
        onSuccess: (result) => {
          setPreparation(result);
          if (result.questions.length === 0) submitFinal(result, {});
        },
        },
      );
      return;
    }
    if (hasAllAnswers) submitFinal(preparation, answers);
  };

  const error = preparationMutation.error || finalizeMutation.error;
  const selectedDiagnosis = diagnoses.find(
    (diagnosis) => diagnosis.id === finalResult?.diagnosticoSeleccionadoId,
  );

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
            disabled={Boolean(finalResult)}
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
            disabled={Boolean(finalResult)}
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
        {error && (
          <Alert severity="error" sx={{ mx: 2, mb: 1 }}>
            {getApiErrorMessage(error)}
          </Alert>
        )}
        {preparation && !finalResult && (
          <Box sx={{ px: 2, pb: 1 }}>
            {preparation.candidates.length === 0 ? (
              <Alert severity="info">
                No hay diagnósticos candidatos que cumplan los criterios
                clínicos presentes.
              </Alert>
            ) : (
              <Alert severity="info">
                Candidatos después de evaluar los criterios básicos:{" "}
                {preparation.candidates
                  .map((candidate) => candidate.diagnosis)
                  .join(", ")}
                {". La sugerencia final se determinará con las respuestas."}
              </Alert>
            )}
            {preparation.questions.length > 0 && (
              <Box sx={{ mt: 1.5, display: "grid", gap: 1.5 }}>
                {preparation.questions.map((question) => {
                  const answer = answers[question.ruleIds[0]];
                  return (
                    <FormControl key={question.question}>
                      <FormLabel>{question.question}</FormLabel>
                      <RadioGroup
                        row
                        value={answer === undefined ? "" : String(answer)}
                        onChange={(_, value) => {
                          const selectedAnswer = Number(value) as 0 | 1;
                          setAnswers((current) => ({
                            ...current,
                            ...Object.fromEntries(
                              question.ruleIds.map((ruleId) => [
                                ruleId,
                                selectedAnswer,
                              ]),
                            ),
                          }));
                        }}
                      >
                        <FormControlLabel
                          value="1"
                          control={<Radio size="small" />}
                          label="Sí"
                        />
                        <FormControlLabel
                          value="0"
                          control={<Radio size="small" />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  );
                })}
              </Box>
            )}
          </Box>
        )}
        {finalResult && (
          <Box sx={{ px: 2, pb: 1 }}>
            {finalResult.candidates.length === 0 &&
            finalResult.suggestedDiagnosis ? (
              <Alert severity="warning">
                Resultado del sistema: {finalResult.suggestedDiagnosis.diagnosis}.
              </Alert>
            ) : finalResult.candidates.length === 0 ? (
              <Alert severity="info">
                El sistema no encontró candidatos finales. No se generó una
                sugerencia.
              </Alert>
            ) : finalResult.candidates.length === 1 ? (
              <Alert severity="success">
                Sugerencia única del sistema: {finalResult.suggestedDiagnosis?.diagnosis}.
              </Alert>
            ) : (
              <Alert severity="warning">
                Hay varios candidatos y no existe una sugerencia única:{" "}
                {finalResult.candidates
                  .map((candidate) => candidate.diagnosis)
                  .join(", ")}.
              </Alert>
            )}
            <Typography variant="body2" sx={{ mt: 1 }}>
              Diagnóstico seleccionado por el psicólogo: {selectedDiagnosis?.nombre}
            </Typography>
          </Box>
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
                    onClick={() => {
                      if (isPending || finalResult) return;
                      setSelectedId(selected ? null : diagnosis.id);
                      setPreparation(null);
                      setAnswers({});
                    }}
                    sx={{
                      cursor: isPending || finalResult ? "default" : "pointer",
                    }}
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
          {finalResult
            ? "La evaluación diagnóstica fue guardada."
            : "La selección del psicólogo se conservará independientemente de la sugerencia."}
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button onClick={handleClose} disabled={isPending}>
            {finalResult ? "Cerrar" : "Cancelar"}
          </Button>
          <Button
            variant="contained"
            onClick={finalResult ? handleClose : handleSave}
            disabled={
              isPending ||
              (!finalResult &&
                (selectedId === null ||
                  (preparation !== null && !hasAllAnswers)))
            }
          >
            {preparationMutation.isPending
              ? "Evaluando..."
              : finalizeMutation.isPending
                ? "Guardando..."
                : finalResult
                  ? "Listo"
                  : preparation
                    ? "Guardar diagnóstico"
                    : "Guardar"}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
