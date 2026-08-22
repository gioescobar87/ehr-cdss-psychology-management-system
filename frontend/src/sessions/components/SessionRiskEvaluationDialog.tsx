import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type {
  RiskLevel,
  RiskType,
  SessionRiskEvaluation,
} from "../types/sessionRiskEvaluation.types";

import { useRiskLevels, useRiskTypes } from "../hooks/useSessionRiskEvaluation";
import {
  useCreateRiskEvaluation,
  useUpdateRiskEvaluation,
} from "../hooks/useSessionRiskEvaluationMutations";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionRiskEvaluationDialogProps {
  open: boolean;
  sessionId: number;
  patientId: number;
  evaluation?: SessionRiskEvaluation | null;
  onClose: () => void;
}

function isActiveStatus(status?: string | null): boolean {
  if (!status) {
    return false;
  }

  const normalizedStatus = status.trim().toUpperCase();

  return normalizedStatus === "ACTIVE" || normalizedStatus === "ACTIVO";
}

function getCurrentLocalDateTime(): string {
  const now = new Date();

  const pad = (value: number) => String(value).padStart(2, "0");

  return [
    now.getFullYear(),
    "-",
    pad(now.getMonth() + 1),
    "-",
    pad(now.getDate()),
    "T",
    pad(now.getHours()),
    ":",
    pad(now.getMinutes()),
    ":",
    pad(now.getSeconds()),
  ].join("");
}

export default function SessionRiskEvaluationDialog({
  open,
  sessionId,
  patientId,
  evaluation = null,
  onClose,
}: SessionRiskEvaluationDialogProps) {
  const [riskTypeId, setRiskTypeId] = useState<number | "">(
    evaluation?.tipoRiesgoId ?? "",
  );
  const [riskLevelId, setRiskLevelId] = useState<number | "">(
    evaluation?.nivelRiesgoId ?? "",
  );
  const [observations, setObservations] = useState(
    evaluation?.observaciones ?? "",
  );

  const {
    data: riskTypes = [],
    isLoading: isLoadingTypes,
    isError: isTypesError,
  } = useRiskTypes(open);

  const {
    data: riskLevels = [],
    isLoading: isLoadingLevels,
    isError: isLevelsError,
  } = useRiskLevels(open);

  const createMutation = useCreateRiskEvaluation();
  const updateMutation = useUpdateRiskEvaluation();

  const { showSuccess } = useNotification();
  const isEditMode = evaluation !== null;
  const mutation = isEditMode ? updateMutation : createMutation;

  useEffect(() => {
    if (open) {
      setRiskTypeId(evaluation?.tipoRiesgoId ?? "");
      setRiskLevelId(evaluation?.nivelRiesgoId ?? "");
      setObservations(evaluation?.observaciones ?? "");
    }
  }, [open, evaluation]);

  const availableRiskTypes = useMemo(
    () => riskTypes.filter((type) => isActiveStatus(type.estado)),
    [riskTypes],
  );

  const availableRiskLevels = useMemo(
    () => riskLevels.filter((level) => isActiveStatus(level.estado)),
    [riskLevels],
  );

  const handleClose = () => {
    if (mutation.isPending) {
      return;
    }

    setRiskTypeId("");
    setRiskLevelId("");
    setObservations("");

    onClose();
  };

  const handleSave = () => {
    if (riskTypeId === "" || riskLevelId === "" || mutation.isPending) {
      return;
    }

    const request = {
      pacienteId: patientId,
      sesionId: sessionId,
      tipoRiesgoId: riskTypeId,
      nivelRiesgoId: riskLevelId,
      observaciones: observations.trim() || undefined,
      fecha: evaluation?.fecha ?? getCurrentLocalDateTime(),
    };

    const options = {
      onSuccess: () => {
        showSuccess(
          isEditMode
            ? "El riesgo fue actualizado correctamente."
            : "El riesgo fue registrado correctamente.",
        );

        handleClose();
      },
    };

    if (isEditMode && evaluation) {
      updateMutation.mutate({ id: evaluation.id, request }, options);
    } else {
      createMutation.mutate(request, options);
    }
  };

  const errorMessage = mutation.error
    ? getApiErrorMessage(mutation.error)
    : null;

  const isLoading = isLoadingTypes || isLoadingLevels;

  const isSaveDisabled =
    riskTypeId === "" || riskLevelId === "" || mutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditMode
          ? "Editar riesgo identificado"
          : "Registrar riesgo identificado"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Registre el nivel de riesgo identificado durante esta sesión. La
            evaluación quedará asociada al paciente y a la sesión actual.
          </Typography>

          {(isTypesError || isLevelsError) && (
            <Alert severity="error">
              No fue posible cargar el catálogo de riesgo.
            </Alert>
          )}

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <FormControl fullWidth disabled={isLoading || mutation.isPending}>
            <InputLabel id="risk-type-label">Tipo de riesgo</InputLabel>

            <Select<number | "">
              labelId="risk-type-label"
              value={riskTypeId}
              label="Tipo de riesgo"
              onChange={(event) => {
                const value = event.target.value;

                setRiskTypeId(value === "" ? "" : Number(value));
              }}
            >
              <MenuItem value="">
                <em>Seleccione un tipo de riesgo</em>
              </MenuItem>

              {availableRiskTypes.map((type: RiskType) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth disabled={isLoading || mutation.isPending}>
            <InputLabel id="risk-level-label">Nivel de riesgo</InputLabel>

            <Select<number | "">
              labelId="risk-level-label"
              value={riskLevelId}
              label="Nivel de riesgo"
              onChange={(event) => {
                const value = event.target.value;

                setRiskLevelId(value === "" ? "" : Number(value));
              }}
            >
              <MenuItem value="">
                <em>Seleccione un nivel de riesgo</em>
              </MenuItem>

              {availableRiskLevels.map((level: RiskLevel) => (
                <MenuItem key={level.id} value={level.id}>
                  {level.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            multiline
            minRows={4}
            label="Observaciones"
            value={observations}
            onChange={(event) => setObservations(event.target.value)}
            disabled={mutation.isPending}
            placeholder="Registre los hallazgos u observaciones clínicas relevantes."
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={mutation.isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          {mutation.isPending
            ? "Guardando..."
            : isEditMode
              ? "Guardar cambios"
              : "Registrar riesgo"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
