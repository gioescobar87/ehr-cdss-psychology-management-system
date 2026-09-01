import { useMemo, useState } from "react";

import {
  Box,
  IconButton,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import PageHeader from "../../shared/components/common/PageHeader";
import AppButton from "../../shared/components/common/AppButton";
import DataTable from "../../shared/components/tables/DataTable";
import CrudToolbar from "../../shared/components/common/CrudToolbar";
import StatusToggle from "../components/StatusToggle";
import RolFormDialog from "../components/RolFormDialog";

import { useGetAll, useChangeStatus } from "../hooks/useRol";

import { useGetAllEstados } from "../../catalog/hooks/useEstados";

import type { Response } from "../types/rol.types";
import type { DataTableColumn } from "../../shared/components/tables/DataTable.types";

function isActive(estado: string): boolean {
  return estado.trim().toUpperCase() === "ACTIVO";
}

export default function RolListPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRol, setEditingRol] = useState<Response | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const { data: roles = [], isLoading, isError } = useGetAll();

  const { data: states = [] } = useGetAllEstados();

  const changeStatus = useChangeStatus();

  const activeState = states.find((state) => isActive(state.nombre));

  const inactiveState = states.find((state) => !isActive(state.nombre));

  const filteredRoles = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    let filtered = roles;

    if (normalized) {
      filtered = filtered.filter((rol) =>
        `${rol.nombre} ${rol.descripcion ?? ""}`
          .toLowerCase()
          .includes(normalized),
      );
    }

    if (statusFilter === "ACTIVE") {
      filtered = filtered.filter((rol) => isActive(rol.estado));
    } else if (statusFilter === "INACTIVE") {
      filtered = filtered.filter((rol) => !isActive(rol.estado));
    }

    return [...filtered].sort((a, b) => {
      const nameComparison = a.nombre.localeCompare(b.nombre);

      if (nameComparison !== 0) {
        return nameComparison;
      }

      const aIsActive = isActive(a.estado);
      const bIsActive = isActive(b.estado);

      return bIsActive === aIsActive ? 0 : bIsActive ? -1 : 1;
    });
  }, [roles, search, statusFilter]);

  const columns: DataTableColumn<Response>[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 60,
      align: "center",
      value: (rol) => rol.id,
    },
    {
      id: "nombre",
      label: "Nombre",
      minWidth: 180,
      value: (rol) => rol.nombre,
    },
    {
      id: "descripcion",
      label: "Descripción",
      minWidth: 260,
      value: (rol) => rol.descripcion || "-",
    },
    {
      id: "estado",
      label: "Estado",
      minWidth: 140,
      align: "center",
      render: (rol) => (
        <StatusToggle
          active={isActive(rol.estado)}
          disabled={
            changeStatus.isPending && changeStatus.variables?.id === rol.id
          }
          onChange={(active) => {
            const targetState = active ? activeState : inactiveState;

            if (!targetState) {
              return;
            }

            changeStatus.mutate({
              id: rol.id,
              estadoId: targetState.id,
            });
          }}
        />
      ),
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 80,
      align: "center",
      render: (rol) => {
        const active = isActive(rol.estado);

        return (
          <Tooltip title={active ? "Editar rol" : "Rol inactivo"}>
            <span>
              <IconButton
                size="small"
                disabled={!active}
                onClick={(event) => {
                  event.stopPropagation();

                  setEditingRol(rol);
                  setDialogOpen(true);
                }}
                aria-label={
                  active
                    ? `Editar rol ${rol.nombre}`
                    : `Rol ${rol.nombre} inactivo`
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
      {/* Fixed Header */}
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 3,
          pb: 2,
        }}
      >
        <PageHeader
          title="Roles"
          description="Administración de los roles del sistema y sus permisos."
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
            searchPlaceholder="Buscar rol..."
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
            aria-label="Filtrar roles por estado"
          >
            <ToggleButton value="ALL">Todos</ToggleButton>

            <ToggleButton value="ACTIVE">Activos</ToggleButton>

            <ToggleButton value="INACTIVE">Inactivos</ToggleButton>
          </ToggleButtonGroup>

          <AppButton
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingRol(null);
              setDialogOpen(true);
            }}
            variant="contained"
          >
            Nuevo rol
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
            rows={isError ? [] : filteredRoles}
            getRowId={(rol) => rol.id}
            loading={isLoading}
            emptyMessage={
              isError
                ? "No fue posible cargar los roles."
                : "No se encontraron roles."
            }
            ariaLabel="Lista de roles"
            maxHeight="100%"
            stickyHeader={true}
          />
        </Box>
      </Box>

      <RolFormDialog
        open={dialogOpen}
        editingRol={editingRol}
        onClose={() => {
          setDialogOpen(false);
          setEditingRol(null);
        }}
        onSuccess={() => {
          // React Query handles the list refresh.
        }}
      />
    </>
  );
}
