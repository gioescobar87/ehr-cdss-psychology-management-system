import { useMemo, useState } from "react";

import {
  Box,
  Chip,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import PageHeader from "../../shared/components/common/PageHeader";
import AppButton from "../../shared/components/common/AppButton";
import DataTable from "../../shared/components/tables/DataTable";
import CrudToolbar from "../../shared/components/common/CrudToolbar";
import StatusToggle from "../components/StatusToggle";
import UsuarioFormDialog from "../components/UsuarioFormDialog";

import { useGetAll, useChangeStatus } from "../hooks/useUsuario";
import { useGetAllEstados } from "../../catalog/hooks/useEstados";
import type { Response } from "../types/usuario.types";
import type { DataTableColumn } from "../../shared/components/tables/DataTable.types";

function isActive(estado: string): boolean {
  return estado.trim().toUpperCase() === "ACTIVO";
}

export default function UsuarioListPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState<Response | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const { data: usuarios = [], isLoading, isError } = useGetAll();
  const { data: states = [] } = useGetAllEstados();
  const changeStatus = useChangeStatus();

  const activeState = states.find((state) => isActive(state.nombre));
  const inactiveState = states.find((state) => !isActive(state.nombre));

  const filteredUsuarios = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    let filtered = usuarios;

    if (normalized) {
      filtered = filtered.filter((usuario) =>
        `${usuario.username} ${usuario.nombre} ${usuario.apellido} ${usuario.correo}`
          .toLowerCase()
          .includes(normalized),
      );
    }

    if (statusFilter === "ACTIVE") {
      filtered = filtered.filter((usuarios) => isActive(usuarios.estado));
    } else if (statusFilter === "INACTIVE") {
      filtered = filtered.filter((usuario) => !isActive(usuario.estado));
    }

    return [...filtered].sort((a, b) => {
      const apellidoComparison = a.apellido.localeCompare(b.apellido);

      if (apellidoComparison !== 0) {
        return apellidoComparison;
      }

      const aIsActive = isActive(a.estado);
      const bIsActive = isActive(b.estado);

      return bIsActive === aIsActive ? 0 : bIsActive ? -1 : 1;
    });
  }, [usuarios, search, statusFilter]);

  const columns: DataTableColumn<Response>[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 60,
      align: "center",
      value: (usuario) => usuario.id,
    },
    {
      id: "username",
      label: "Usuario",
      minWidth: 140,
      value: (usuario) => usuario.username,
    },
    {
      id: "nombre",
      label: "Nombre completo",
      minWidth: 200,
      value: (usuario) => `${usuario.apellido}, ${usuario.nombre}`,
    },
    {
      id: "correo",
      label: "Correo",
      minWidth: 220,
      value: (usuario) => usuario.correo,
    },
    {
      id: "roles",
      label: "Roles",
      minWidth: 220,
      align: "center",
      render: (usuario) => (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 0.5,
            justifyContent: "center",
          }}
        >
          {usuario.roles?.length > 0 ? (
            usuario.roles.map((role) => (
              <Chip
                key={role.id}
                label={role.nombre}
                size="small"
                variant="outlined"
              />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              ---
            </Typography>
          )}
        </Box>
      ),
    },
    {
      id: "estado",
      label: "Estado",
      minWidth: 140,
      align: "center",
      render: (usuario) => (
        <StatusToggle
          active={isActive(usuario.estado)}
          disabled={
            changeStatus.isPending && changeStatus.variables?.id === usuario.id
          }
          onChange={(active) => {
            const targetState = active ? activeState : inactiveState;

            if (!targetState) {
              return;
            }

            changeStatus.mutate({ id: usuario.id, estadoId: targetState.id });
          }}
        />
      ),
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 80,
      align: "center",
      render: (usuario) => {
        const active = isActive(usuario.estado);

        return (
          <Tooltip title={active ? "Editar usuario" : "Usuario inactivo"}>
            <span>
              <IconButton
                size="small"
                disabled={!active}
                onClick={(event) => {
                  event.stopPropagation();
                  setEditingUsuario(usuario);
                  setDialogOpen(true);
                }}
                aria-label={
                  active
                    ? `Editar usuario ${usuario.username}`
                    : `Usuario ${usuario.username} inactivo`
                }
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        );
      },
    },
  ];

  return (
    <>
      {/* Fixed Header - Not scrollable */}
      <Box sx={{ px: { xs: 2, sm: 3 }, pt: 3, pb: 2 }}>
        <PageHeader
          title="Usuarios"
          description="Administración de los usuarios del sistema y sus roles."
        />
      </Box>

      {/* Workspace Container */}
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto minmax(0, 1fr)",
          height: { xs: "auto", md: 620 },
          minHeight: { xs: 400, md: 560 },
          mx: { xs: 2, sm: 3 },
          mb: { xs: 2, sm: 3 },
          border: 1,
          borderColor: "divider",
          borderRadius: 2,
          overflow: "hidden",
          bgcolor: "background.paper",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Toolbar Area */}
        <Box
          sx={{
            px: 2,
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <CrudToolbar
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Buscar usuario..."
            fullWidth
          />
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={(_, value) => {
              if (value !== null) {
                setStatusFilter(value);
              }
            }}
            size="small"
            aria-label="Filtrar usuarios por estado"
          >
            <ToggleButton value="ALL">Todos</ToggleButton>
            <ToggleButton value="ACTIVE">Activos</ToggleButton>
            <ToggleButton value="INACTIVE">Inactivos</ToggleButton>
          </ToggleButtonGroup>
          <AppButton
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingUsuario(null);
              setDialogOpen(true);
            }}
            variant="contained"
          >
            Nuevo usuario
          </AppButton>
        </Box>

        {/* Scrollable Table Area */}
        <Box
          sx={{
            minWidth: 0,
            minHeight: 0,
            overflow: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DataTable
            columns={columns}
            rows={isError ? [] : filteredUsuarios}
            getRowId={(usuario) => usuario.id}
            loading={isLoading}
            emptyMessage={
              isError
                ? "No fue posible cargar los usuarios."
                : "No se encontraron usuarios."
            }
            ariaLabel="Lista de usuarios"
            maxHeight="100%"
            stickyHeader={true}
          />
        </Box>
      </Box>

      <UsuarioFormDialog
        open={dialogOpen}
        editingUsuario={editingUsuario}
        onClose={() => {
          setDialogOpen(false);
          setEditingUsuario(null);
        }}
        onSuccess={() => {
          // Dialog handles closing and refresh via react-query
        }}
      />
    </>
  );
}
