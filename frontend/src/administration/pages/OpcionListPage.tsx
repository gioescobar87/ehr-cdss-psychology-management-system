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
import OpcionFormDialog from "../components/OpcionFormDialog";

import { useGetAll, useChangeStatus } from "../hooks/useOpcion";
import { useGetAll as useGetAllModulos } from "../hooks/useModulo";
import { useGetAllEstados } from "../../catalog/hooks/useEstados";

import type { Response } from "../types/opcion.types";
import type { DataTableColumn } from "../../shared/components/tables/DataTable.types";

function isActive(estado: string): boolean {
  return estado.trim().toUpperCase() === "ACTIVO";
}

export default function OpcionListPage() {
  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingOpcion, setEditingOpcion] = useState<Response | null>(null);

  const [statusFilter, setStatusFilter] = useState<
    "ALL" | "ACTIVE" | "INACTIVE"
  >("ALL");

  const { data: opciones = [], isLoading, isError } = useGetAll();

  const { data: modulos = [] } = useGetAllModulos();

  const { data: states = [] } = useGetAllEstados();

  const changeStatus = useChangeStatus();

  const activeState = states.find((state) => isActive(state.nombre));

  const inactiveState = states.find((state) => !isActive(state.nombre));

  const modulosById = useMemo(
    () => new Map(modulos.map((modulo) => [modulo.id, modulo.nombre])),
    [modulos],
  );

  const filteredOpciones = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    let filtered = opciones;

    if (normalized) {
      filtered = filtered.filter((opcion) =>
        `${opcion.nombre} ${opcion.descripcion ?? ""} ${opcion.rutaFrontend}`
          .toLowerCase()
          .includes(normalized),
      );
    }

    if (statusFilter === "ACTIVE") {
      filtered = filtered.filter((opcion) => isActive(opcion.estado));
    } else if (statusFilter === "INACTIVE") {
      filtered = filtered.filter((opcion) => !isActive(opcion.estado));
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
  }, [opciones, search, statusFilter]);

  const columns: DataTableColumn<Response>[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 60,
      align: "center",
      value: (opcion) => opcion.id,
    },
    {
      id: "nombre",
      label: "Nombre",
      minWidth: 180,
      value: (opcion) => opcion.nombre,
    },
    {
      id: "modulo",
      label: "Módulo",
      minWidth: 140,
      value: (opcion) => modulosById.get(opcion.moduloId) ?? "-",
    },
    {
      id: "rutaFrontend",
      label: "Ruta",
      minWidth: 200,
      value: (opcion) => opcion.rutaFrontend,
    },
    {
      id: "visibleMenu",
      label: "Menú",
      minWidth: 100,
      align: "center",
      render: (opcion) =>
        opcion.visibleMenu ? (
          <StatusToggle active disabled onChange={() => undefined} />
        ) : (
          <StatusToggle active={false} disabled onChange={() => undefined} />
        ),
    },
    {
      id: "estado",
      label: "Estado",
      minWidth: 140,
      align: "center",
      render: (opcion) => (
        <StatusToggle
          active={isActive(opcion.estado)}
          disabled={
            changeStatus.isPending && changeStatus.variables?.id === opcion.id
          }
          onChange={(active) => {
            const targetState = active ? activeState : inactiveState;

            if (!targetState) {
              return;
            }

            changeStatus.mutate({
              id: opcion.id,
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
      render: (opcion) => {
        const active = isActive(opcion.estado);

        return (
          <Tooltip title={active ? "Editar opción" : "Opción inactiva"}>
            <span>
              <IconButton
                size="small"
                disabled={!active}
                onClick={(event) => {
                  event.stopPropagation();

                  setEditingOpcion(opcion);
                  setDialogOpen(true);
                }}
                aria-label={
                  active
                    ? `Editar opción ${opcion.nombre}`
                    : `Opción ${opcion.nombre} inactiva`
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
          title="Opciones"
          description="Administración de las opciones de navegación del sistema."
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
            searchPlaceholder="Buscar opción..."
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
            aria-label="Filtrar opciones por estado"
          >
            <ToggleButton value="ALL">Todas</ToggleButton>

            <ToggleButton value="ACTIVE">Activas</ToggleButton>

            <ToggleButton value="INACTIVE">Inactivas</ToggleButton>
          </ToggleButtonGroup>

          <AppButton
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingOpcion(null);
              setDialogOpen(true);
            }}
            variant="contained"
          >
            Nueva opción
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
            rows={isError ? [] : filteredOpciones}
            getRowId={(opcion) => opcion.id}
            loading={isLoading}
            emptyMessage={
              isError
                ? "No fue posible cargar las opciones."
                : "No se encontraron opciones."
            }
            ariaLabel="Lista de opciones"
            maxHeight="100%"
            stickyHeader
          />
        </Box>
      </Box>

      <OpcionFormDialog
        open={dialogOpen}
        editingOpcion={editingOpcion}
        opciones={opciones}
        onClose={() => {
          setDialogOpen(false);
          setEditingOpcion(null);
        }}
        onSuccess={() => {
          // React Query handles the list refresh.
        }}
      />
    </>
  );
}
