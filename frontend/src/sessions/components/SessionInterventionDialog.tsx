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
  Typography,
} from "@mui/material";

import type {
  Intervention,
  InterventionType,
} from "../types/sessionIntervention.types";

import { useCreateSessionIntervention } from "../hooks/useSessionInterventionMutations";
import {
  useInterventionTypes,
  useInterventions,
} from "../hooks/useSessionIntervention";

import { getApiErrorMessage } from "../../shared/utils/apiError";
import { useNotification } from "../../shared/hooks/useNotification";

interface SessionInterventionDialogProps {
  open: boolean;
  sessionId: number;
  assignedInterventionIds: number[];
  onClose: () => void;
}

function isActiveStatus(status?: string | null): boolean {
  if (!status) {
    return false;
  }

  const normalizedStatus = status.trim().toUpperCase();

  return normalizedStatus === "ACTIVE" || normalizedStatus === "ACTIVO";
}

export default function SessionInterventionDialog({
  open,
  sessionId,
  assignedInterventionIds,
  onClose,
}: SessionInterventionDialogProps) {
  const [typeId, setTypeId] = useState<number | "">("");
  const [interventionId, setInterventionId] = useState<number | "">("");

  const {
    data: interventionTypes = [],
    isLoading: isLoadingTypes,
    isError: isTypesError,
  } = useInterventionTypes(open);

  const {
    data: interventions = [],
    isLoading: isLoadingInterventions,
    isError: isInterventionsError,
  } = useInterventions(open);

  const createMutation = useCreateSessionIntervention();
  const { showSuccess } = useNotification();

  const availableTypes = useMemo(
    () => interventionTypes.filter((type) => isActiveStatus(type.estado)),
    [interventionTypes],
  );

  const availableInterventions = useMemo(() => {
    if (typeId === "") {
      return [];
    }

    return interventions.filter((intervention) => {
      const matchesType = Number(intervention.tipoIntervencionId) === typeId;

      const isActive = isActiveStatus(intervention.estado);

      const isAlreadyAssigned = assignedInterventionIds.includes(
        intervention.id,
      );

      return matchesType && isActive && !isAlreadyAssigned;
    });
  }, [interventions, typeId, assignedInterventionIds]);

  const selectedIntervention = useMemo<Intervention | undefined>(
    () =>
      interventions.find(
        (intervention) => Number(intervention.id) === Number(interventionId),
      ),
    [interventions, interventionId],
  );

  const handleTypeChange = (value: number | "") => {
    setTypeId(value);
    setInterventionId("");
  };

  const handleInterventionChange = (value: number | "") => {
    setInterventionId(value);
  };

  const handleClose = () => {
    if (createMutation.isPending) {
      return;
    }

    setTypeId("");
    setInterventionId("");
    onClose();
  };

  const handleSave = () => {
    if (typeId === "" || interventionId === "" || createMutation.isPending) {
      return;
    }

    createMutation.mutate(
      {
        sesionId: sessionId,
        intervencionId: interventionId,
      },
      {
        onSuccess: () => {
          showSuccess("La intervención fue registrada correctamente.");

          handleClose();
        },
      },
    );
  };

  const error = createMutation.error;
  const errorMessage = error ? getApiErrorMessage(error) : null;

  const isLoading = isLoadingTypes || isLoadingInterventions;

  const isSaveDisabled =
    typeId === "" || interventionId === "" || createMutation.isPending;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>Registrar intervención</DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Seleccione una intervención del catálogo clínico.
          </Typography>

          {(isTypesError || isInterventionsError) && (
            <Alert severity="error">
              No fue posible cargar el catálogo de intervenciones.
            </Alert>
          )}

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <FormControl
            fullWidth
            disabled={isLoading || createMutation.isPending}
          >
            <InputLabel id="intervention-type-label">
              Tipo de intervención
            </InputLabel>

            <Select<number | "">
              labelId="intervention-type-label"
              value={typeId}
              label="Tipo de intervención"
              onChange={(event) => {
                const value = event.target.value;

                handleTypeChange(value === "" ? "" : Number(value));
              }}
            >
              <MenuItem value="">
                <em>Seleccione un tipo</em>
              </MenuItem>

              {availableTypes.map((type: InterventionType) => (
                <MenuItem key={type.id} value={type.id}>
                  {type.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            fullWidth
            disabled={typeId === "" || isLoading || createMutation.isPending}
          >
            <InputLabel id="intervention-label">Intervención</InputLabel>

            <Select<number | "">
              labelId="intervention-label"
              value={interventionId}
              label="Intervención"
              onChange={(event) => {
                const value = event.target.value;

                handleInterventionChange(value === "" ? "" : Number(value));
              }}
            >
              <MenuItem value="">
                <em>Seleccione una intervención</em>
              </MenuItem>

              {availableInterventions.map((intervention) => (
                <MenuItem key={intervention.id} value={intervention.id}>
                  {intervention.nombre}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {selectedIntervention?.descripcion && (
            <Alert severity="info">{selectedIntervention.descripcion}</Alert>
          )}

          {typeId !== "" &&
            availableInterventions.length === 0 &&
            !isLoading && (
              <Alert severity="info">
                No hay intervenciones disponibles para el tipo seleccionado.
              </Alert>
            )}
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
          {createMutation.isPending ? "Registrando..." : "Registrar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
