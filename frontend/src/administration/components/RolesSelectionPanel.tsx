import { useMemo, useState } from "react";

import {
  Alert,
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { useGetAll as useGetAllRoles } from "../hooks/useRol";

interface RolesSelectionPanelProps {
  selectedRoleIds: number[];
  onChange: (roleIds: number[]) => void;
  loading?: boolean;
}

export default function RolesSelectionPanel({
  selectedRoleIds,
  onChange,
  loading = false,
}: RolesSelectionPanelProps) {
  const [search, setSearch] = useState("");

  const { data: allRoles = [], isLoading: loadingRoles } = useGetAllRoles();

  const selectedIds = useMemo(
    () => new Set(selectedRoleIds),
    [selectedRoleIds],
  );

  const filteredRoles = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    if (!normalized) {
      return allRoles;
    }

    return allRoles.filter((rol) =>
      rol.nombre.toLowerCase().includes(normalized),
    );
  }, [allRoles, search]);

  const handleToggle = (rolId: number, checked: boolean) => {
    if (checked) {
      onChange([...selectedRoleIds, rolId]);
    } else {
      onChange(selectedRoleIds.filter((id) => id !== rolId));
    }
  };

  const isLoading = loadingRoles || loading;

  return (
    <Stack spacing={2}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
          Roles de usuario *
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Seleccione al menos un rol para este usuario.
        </Typography>
      </Box>

      <TextField
        size="small"
        placeholder="Buscar rol..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        disabled={isLoading}
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
      ) : filteredRoles.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No se encontraron roles.
        </Typography>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
            gap: 0.5,
            maxHeight: 280,
            overflowY: "auto",
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 1.5,
          }}
        >
          {filteredRoles.map((rol) => {
            const checked = selectedIds.has(rol.id);

            return (
              <FormControlLabel
                key={rol.id}
                control={
                  <Checkbox
                    checked={checked}
                    disabled={isLoading}
                    onChange={(event) =>
                      handleToggle(rol.id, event.target.checked)
                    }
                  />
                }
                label={rol.nombre}
              />
            );
          })}
        </Box>
      )}

      {allRoles.length > 0 && selectedRoleIds.length === 0 && (
        <Alert severity="warning" sx={{ mt: 1 }}>
          Debe seleccionar al menos un rol.
        </Alert>
      )}
    </Stack>
  );
}
