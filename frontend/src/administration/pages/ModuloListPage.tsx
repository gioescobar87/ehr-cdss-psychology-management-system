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
import ModuloFormDialog from "../components/ModuloFormDialog";

import { useGetAll, useChangeStatus } from "../hooks/useModulo";
import { useGetAllEstados } from "../../catalog/hooks/useEstados";

import type { Response } from "../types/modulo.types";
import type { DataTableColumn } from "../../shared/components/tables/DataTable.types";

function isActive(estado: string): boolean {
  return estado.trim().toUpperCase() === "ACTIVO";
}

export default function ModuloListPage() {
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingModulo, setEditingModulo] = useState<Response | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const { data: modulos = [], isLoading, isError } = useGetAll();
  const { data: states = [] } = useGetAllEstados();

  const changeStatus = useChangeStatus();

  const activeState = states.find((state) => isActive(state.nombre));

  const inactiveState = states.find((state) => !isActive(state.nombre));

  const filteredModulos = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    let filtered = modulos;

    if (normalized) {
      filtered = filtered.filter((modulo) =>
        `${modulo.nombre} ${modulo.descripcion ?? ""}`
          .toLowerCase()
          .includes(normalized),
      );
    }

    if (statusFilter === "ACTIVE") {
      filtered = filtered.filter((modulo) => isActive(modulo.estado));
    } else if (statusFilter === "INACTIVE") {
      filtered = filtered.filter((modulo) => !isActive(modulo.estado));
    }

    return [...filtered].sort((a, b) => {
      const orderComparison = a.orden - b.orden;

      if (orderComparison !== 0) {
        return orderComparison;
      }

      return a.nombre.localeCompare(b.nombre);
    });
  }, [modulos, search, statusFilter]);

  const columns: DataTableColumn<Response>[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 60,
      align: "center",
      value: (modulo) => modulo.id,
    },
    {
      id: "nombre",
      label: "Nombre",
      minWidth: 180,
      value: (modulo) => modulo.nombre,
    },
    {
      id: "descripcion",
      label: "Descripción",
      minWidth: 260,
      value: (modulo) => modulo.descripcion || "-",
    },
    {
      id: "orden",
      label: "Orden",
      minWidth: 80,
      align: "center",
      value: (modulo) => modulo.orden,
    },
    {
      id: "estado",
      label: "Estado",
      minWidth: 140,
      align: "center",
      render: (modulo) => (
        <StatusToggle
          active={isActive(modulo.estado)}
          disabled={
            changeStatus.isPending && changeStatus.variables?.id === modulo.id
          }
          onChange={(active) => {
            const targetState = active ? activeState : inactiveState;

            if (!targetState) {
              return;
            }

            changeStatus.mutate({
              id: modulo.id,
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
      render: (modulo) => {
        const active = isActive(modulo.estado);

        return (
          <Tooltip title={active ? "Editar módulo" : "Módulo inactivo"}>
            <span>
              <IconButton
                size="small"
                disabled={!active}
                onClick={(event) => {
                  event.stopPropagation();

                  setEditingModulo(modulo);
                  setDialogOpen(true);
                }}
                aria-label={
                  active
                    ? `Editar módulo ${modulo.nombre}`
                    : `Módulo ${modulo.nombre} inactivo`
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
      <Box
        sx={{
          px: { xs: 2, sm: 3 },
          pt: 3,
          pb: 2,
        }}
      >
        <PageHeader
          title="Módulos"
          description="Administración de los módulos de navegación del sistema."
        />
      </Box>

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
            searchPlaceholder="Buscar módulo..."
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
            aria-label="Filtrar módulos por estado"
          >
            <ToggleButton value="ALL">Todos</ToggleButton>

            <ToggleButton value="ACTIVE">Activos</ToggleButton>

            <ToggleButton value="INACTIVE">Inactivos</ToggleButton>
          </ToggleButtonGroup>

          <AppButton
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingModulo(null);
              setDialogOpen(true);
            }}
            variant="contained"
          >
            Nuevo módulo
          </AppButton>
        </Box>

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
            rows={isError ? [] : filteredModulos}
            getRowId={(modulo) => modulo.id}
            loading={isLoading}
            emptyMessage={
              isError
                ? "No fue posible cargar los módulos."
                : "No se encontraron módulos."
            }
            ariaLabel="Lista de módulos"
            maxHeight="100%"
            stickyHeader={true}
          />
        </Box>
      </Box>

      <ModuloFormDialog
        open={dialogOpen}
        editingModulo={editingModulo}
        onClose={() => {
          setDialogOpen(false);
          setEditingModulo(null);
        }}
        onSuccess={() => {
          // React Query handles the list refresh.
        }}
      />
    </>
  );
}
