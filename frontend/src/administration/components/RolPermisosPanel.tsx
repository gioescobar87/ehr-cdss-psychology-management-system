import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

import { useGetAllPermisos } from "../hooks/usePermiso";
import {
  useAssignPermiso,
  useRemovePermiso,
  useRolPermisos,
} from "../hooks/useRol";

interface RolPermisosPanelProps {
  rolId: number;
}

export default function RolPermisosPanel({ rolId }: RolPermisosPanelProps) {
  const [search, setSearch] = useState("");

  const { data: allPermisos = [], isLoading: loadingPermisos } =
    useGetAllPermisos();
  const {
    data: assignedPermisos = [],
    isLoading: loadingAssigned,
    isError,
  } = useRolPermisos(rolId);

  const assignMutation = useAssignPermiso();
  const removeMutation = useRemovePermiso();

  const assignedIds = useMemo(
    () => new Set(assignedPermisos.map((permiso) => permiso.id)),
    [assignedPermisos],
  );

  const filteredPermisos = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return allPermisos;
    }

    return allPermisos.filter((permiso) =>
      permiso.nombre.toLowerCase().includes(normalized),
    );
  }, [allPermisos, search]);

  const isLoading = loadingPermisos || loadingAssigned;

  const handleToggle = (permisoId: number, checked: boolean) => {
    if (checked) {
      assignMutation.mutate({ rolId, permisoId });
    } else {
      removeMutation.mutate({ rolId, permisoId });
    }
  };

  if (isError) {
    return (
      <Alert severity="error">
        No fue posible cargar los permisos asignados a este rol.
      </Alert>
    );
  }

  return (
    <Stack spacing={2}>
      <Typography variant="body2" color="text.secondary">
        Seleccione los permisos que este rol otorgará a los usuarios que lo
        tengan asignado.
      </Typography>

      <TextField
        size="small"
        placeholder="Buscar permiso..."
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
      ) : filteredPermisos.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No se encontraron permisos.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 0.5,
            maxHeight: 420,
            overflowY: "auto",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          {filteredPermisos.map((permiso) => {
            const checked = assignedIds.has(permiso.id);
            const isMutating =
              (assignMutation.isPending &&
                assignMutation.variables?.permisoId === permiso.id) ||
              (removeMutation.isPending &&
                removeMutation.variables?.permisoId === permiso.id);

            return (
              <FormControlLabel
                key={permiso.id}
                control={
                  <Checkbox
                    checked={checked}
                    disabled={isMutating}
                    onChange={(event) =>
                      handleToggle(permiso.id, event.target.checked)
                    }
                  />
                }
                label={permiso.nombre}
              />
            );
          })}
        </Box>
      )}
    </Stack>
  );
}
