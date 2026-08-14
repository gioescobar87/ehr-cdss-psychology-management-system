import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";

import { useNavigate } from "react-router-dom";
import PageHeader from "../../../shared/components/common/PageHeader";
import AppButton from "../../../shared/components/common/AppButton";
import DataTable from "../../../shared/components/tables/DataTable";

import { useGetAll } from "../../hooks/useTipoSesion";
import type { Response } from "../../types/catalogDTOs.types";
import type { DataTableColumn } from "../../../shared/components/tables/DataTable.types";

export default function TipoSesionListPage() {
  const navigate = useNavigate();

  const specificPath = "tipo-sesion";
  const tittleList = "Tipo Sesión";
  const descriptionList =
    "Administración de las opciones de " +
    tittleList +
    " disponibles en el sistema.";

  const { data: registros = [], isLoading, isError } = useGetAll();

  const columns: DataTableColumn<Response>[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 70,
      align: "center",
      value: (registro) => registro.id,
    },
    {
      id: "nombre",
      label: "Nombre",
      minWidth: 180,
      value: (registro) => registro.nombre,
    },
    {
      id: "descripcion",
      label: "Descripción",
      minWidth: 250,
      value: (registro) => registro.descripcion || "-",
    },
    {
      id: "estado",
      label: "Estado",
      minWidth: 120,
      align: "center",
      value: (registro) => registro.estado,
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 100,
      align: "center",
      render: (registro) => (
        <Tooltip title="Editar registro">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              navigate(`/administration/${specificPath}/${registro.id}/edit`);
            }}
            aria-label={`Editar registro ${registro.nombre}`}
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
          title={tittleList}
          description={descriptionList}
          actions={
            <AppButton
              startIcon={<AddIcon />}
              onClick={() =>
                navigate("/administration/" + specificPath + "/new")
              }
            >
              Nuevo registro
            </AppButton>
          }
        />

        <DataTable
          columns={columns}
          rows={[]}
          getRowId={(registro) => registro.id}
          loading={false}
          emptyMessage="No fue posible cargar los registros."
          ariaLabel="Lista de registros"
        />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={tittleList}
        description={descriptionList}
        actions={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() => navigate("/administration/" + specificPath + "/new")}
          >
            Nuevo registro
          </AppButton>
        }
      />
      <DataTable
        columns={columns}
        rows={registros}
        getRowId={(registro) => registro.id}
        loading={isLoading}
        emptyMessage="No se encontraron registros"
        ariaLabel="Lista de registros"
      />
    </>
  );
}
