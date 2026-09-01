import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useGetAll as useGetAllOpciones } from "../hooks/useOpcion";
import {
  useAssignOpcion,
  useRemoveOpcion,
  useRolOpciones,
} from "../hooks/useRol";

interface RolOpcionesPanelProps {
  rolId: number;
  activeEstadoId: number;
}

export default function RolOpcionesPanel({
  rolId,
  activeEstadoId,
}: RolOpcionesPanelProps) {
  const [search, setSearch] = useState("");

  const { data: allOpciones = [], isLoading: loadingOpciones } =
    useGetAllOpciones();
  const {
    data: assignedOpciones = [],
    isLoading: loadingAssigned,
    isError,
  } = useRolOpciones(rolId);

  const assignMutation = useAssignOpcion();
  const removeMutation = useRemoveOpcion();

  const assignedByOpcionId = useMemo(
    () => new Map(assignedOpciones.map((item) => [item.opcionId, item])),
    [assignedOpciones],
  );

  const filteredOpciones = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return allOpciones;
    }

    return allOpciones.filter((opcion) =>
      opcion.nombre.toLowerCase().includes(normalized),
    );
  }, [allOpciones, search]);

  const isLoading = loadingOpciones || loadingAssigned;

  const handleToggleAssigned = (opcionId: number, checked: boolean) => {
    if (checked) {
      assignMutation.mutate({
        rolId,
        request: { opcionId, visible: true, estadoId: activeEstadoId },
      });
    } else {
      removeMutation.mutate({ rolId, opcionId });
    }
  };

  const handleToggleVisible = (opcionId: number, visible: boolean) => {
    assignMutation.mutate({
      rolId,
      request: { opcionId, visible, estadoId: activeEstadoId },
    });
  };

  if (isError) {
    return (
      <Alert severity="error">
        No fue posible cargar las opciones asignadas a este rol.
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Seleccione las opciones de navegación visibles para este rol. Puede
        controlar además si aparecen en el menú lateral.
      </Typography>

      <TextField
        size="small"
        placeholder="Buscar opción..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          },
        }}
      />

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      ) : filteredOpciones.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No se encontraron opciones.
        </Typography>
      ) : (
        <Stack
          spacing={0.5}
          sx={{
            maxHeight: 420,
            overflowY: "auto",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          {filteredOpciones.map((opcion) => {
            const assigned = assignedByOpcionId.get(opcion.id);
            const isChecked = Boolean(assigned);
            const isMutating =
              (assignMutation.isPending &&
                assignMutation.variables?.request.opcionId === opcion.id) ||
              (removeMutation.isPending &&
                removeMutation.variables?.opcionId === opcion.id);

            return (
              <Box
                key={opcion.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={isChecked}
                      disabled={isMutating}
                      onChange={(event) =>
                        handleToggleAssigned(opcion.id, event.target.checked)
                      }
                    />
                  }
                  label={opcion.nombre}
                />

                {isChecked && (
                  <FormControlLabel
                    control={
                      <Switch
                        size="small"
                        checked={assigned?.visible ?? true}
                        disabled={isMutating}
                        onChange={(event) =>
                          handleToggleVisible(opcion.id, event.target.checked)
                        }
                      />
                    }
                    label="Visible en menú"
                  />
                )}
              </Box>
            );
          })}
        </Stack>
      )}
    </Stack>
  );
}
