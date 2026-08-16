import { useMemo, useState } from "react";

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

import type { RiskLevel, RiskType } from "../types/sessionRiskEvaluation.types";

import { useRiskLevels, useRiskTypes } from "../hooks/useSessionRiskEvaluation";
import { useCreateRiskEvaluation } from "../hooks/useSessionRiskEvaluationMutations";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionRiskEvaluationDialogProps {
  open: boolean;
  sessionId: number;
  patientId: number;
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
  onClose,
}: SessionRiskEvaluationDialogProps) {
  const [riskTypeId, setRiskTypeId] = useState<number | "">("");
  const [riskLevelId, setRiskLevelId] = useState<number | "">("");
  const [observations, setObservations] = useState("");

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

  const { showSuccess } = useNotification();

  const availableRiskTypes = useMemo(
    () => riskTypes.filter((type) => isActiveStatus(type.estado)),
    [riskTypes],
  );

  const availableRiskLevels = useMemo(
    () => riskLevels.filter((level) => isActiveStatus(level.estado)),
    [riskLevels],
  );

  const handleClose = () => {
    if (createMutation.isPending) {
      return;
    }

    setRiskTypeId("");
    setRiskLevelId("");
    setObservations("");

    onClose();
  };

  const handleSave = () => {
    if (riskTypeId === "" || riskLevelId === "" || createMutation.isPending) {
      return;
    }

    createMutation.mutate(
      {
        pacienteId: patientId,
        sesionId: sessionId,
        tipoRiesgoId: riskTypeId,
        nivelRiesgoId: riskLevelId,
        observaciones: observations.trim() || undefined,
        fecha: getCurrentLocalDateTime(),
      },
      {
        onSuccess: () => {
          showSuccess("La evaluación de riesgo fue registrada correctamente.");

          handleClose();
        },
      },
    );
  };

  const errorMessage = createMutation.error
    ? getApiErrorMessage(createMutation.error)
    : null;

  const isLoading = isLoadingTypes || isLoadingLevels;

  const isSaveDisabled =
    riskTypeId === "" || riskLevelId === "" || createMutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar evaluación de riesgo</DialogTitle>

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

          <FormControl
            fullWidth
            disabled={isLoading || createMutation.isPending}
          >
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

          <FormControl
            fullWidth
            disabled={isLoading || createMutation.isPending}
          >
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
            disabled={createMutation.isPending}
            placeholder="Registre los hallazgos u observaciones clínicas relevantes."
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleClose} disabled={createMutation.isPending}>
          Cancelar
        </Button>

        <Button
          variant="contained"
          onClick={handleSave}
          disabled={isSaveDisabled}
        >
          {createMutation.isPending ? "Registrando..." : "Registrar evaluación"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
