import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/common/PageHeader";
import AppButton from "../../../shared/components/common/AppButton";
import DataTable from "../../../shared/components/tables/DataTable";

import { useGetAllPermisos } from "../../hooks/usePermiso";
import type { Response } from "../../types/permiso.types";
import type { DataTableColumn } from "../../../shared/components/tables/DataTable.types";

export default function PermissionListPage() {
  const navigate = useNavigate();

  const { data: permissions = [], isLoading, isError } = useGetAllPermisos();

  const columns: DataTableColumn<Response>[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 70,
      align: "center",
      value: (permission) => permission.id,
    },
    {
      id: "nombre",
      label: "Nombre",
      minWidth: 180,
      value: (permission) => permission.nombre,
    },
    {
      id: "descripcion",
      label: "Descripción",
      minWidth: 250,
      value: (permission) => permission.descripcion || "-",
    },
    {
      id: "estado",
      label: "Estado",
      minWidth: 120,
      align: "center",
      value: (permission) => permission.estado,
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 100,
      align: "center",
      render: (permission) => (
        <Tooltip title="Editar permiso">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/administration/permissions/${permission.id}/edit`);
            }}
            aria-label={`Editar permiso ${permission.nombre}`}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  if (isError) {
    return (
      <>
        <PageHeader
          title="Permisos"
          description="Administración de permisos del sistema."
          actions={
            <AppButton
              startIcon={<AddIcon />}
              onClick={() => navigate("/administration/permissions/new")}
            >
              Nuevo permiso
            </AppButton>
          }
        />

        <DataTable
          columns={columns}
          rows={[]}
          getRowId={(permission) => permission.id}
          loading={false}
          emptyMessage="No fue posible cargar los permisos."
          ariaLabel="Lista de permisos"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Permisos"
        description="Administración de los permisos disponibles en el sistema."
        actions={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() => navigate("/administration/permissions/new")}
          >
            Nuevo permiso
          </AppButton>
        }
      />
      <DataTable
        columns={columns}
        rows={permissions}
        getRowId={(permission) => permission.id}
        loading={isLoading}
        emptyMessage="No se encontraron permisos"
        ariaLabel="Lista de permisos"
      />
    </>
  );
}
