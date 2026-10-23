import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Navigate,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";

import PageHeader from "../../shared/components/common/PageHeader";
import AppButton from "../../shared/components/common/AppButton";
import DataTable from "../../shared/components/tables/DataTable";
import type { DataTableColumn } from "../../shared/components/tables/DataTable.types";
import CatalogForm from "../components/CatalogoForm";
import { basicCatalogApi } from "../api/basicCatalogApi";
import {
  BASIC_CATALOG_PATH,
  getAvailableBasicCatalogs,
  getBasicCatalogQueryKey,
  type BasicCatalog,
} from "../basicCatalogs";
import { useGetAllEstados } from "../hooks/useEstados";
import type { Request, Response } from "../types/catalogDTOs.types";

export default function BasicCatalogPage({
  creating = false,
}: {
  creating?: boolean;
}) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const catalogs = getAvailableBasicCatalogs();
  const selectedId = searchParams.get("catalog") ?? catalogs[0]?.id;
  const selectedCatalog = catalogs.find((catalog) => catalog.id === selectedId);

  return (
    <>
      <PageHeader
        title="Catálogos básicos"
        description="Seleccione el catálogo que desea administrar."
      />
      <Box sx={{ mb: 3, maxWidth: 480 }}>
        <TextField
          select
          fullWidth
          label="Catálogo"
          value={selectedCatalog?.id ?? ""}
          disabled={catalogs.length === 0}
          onChange={(event) => {
            void navigate(
              `${BASIC_CATALOG_PATH}?catalog=${event.target.value}`,
            );
          }}
        >
          {catalogs.map((catalog) => (
            <MenuItem key={catalog.id} value={catalog.id}>
              {catalog.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>
      {selectedCatalog ? (
        <CatalogWorkspace
          key={selectedCatalog.id}
          catalog={selectedCatalog}
          creating={creating}
        />
      ) : (
        <Alert severity="error">
          El catálogo solicitado no existe o no tiene permiso para
          administrarlo.
        </Alert>
      )}
    </>
  );
}

function CatalogWorkspace({
  catalog,
  creating,
}: {
  catalog: BasicCatalog;
  creating: boolean;
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const api = basicCatalogApi[catalog.id];
  const {
    data: records = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: getBasicCatalogQueryKey(catalog.id),
    queryFn: api.getAll,
  });
  const query = `?catalog=${catalog.id}`;
  const listPath = `${BASIC_CATALOG_PATH}${query}`;
  const columns: DataTableColumn<Response>[] = [
    {
      id: "id",
      label: "ID",
      minWidth: 70,
      align: "center",
      value: (record) => record.id,
    },
    {
      id: "nombre",
      label: "Nombre",
      minWidth: 180,
      value: (record) => record.nombre,
    },
    {
      id: "descripcion",
      label: "Descripción",
      minWidth: 250,
      value: (record) => record.descripcion || "-",
    },
    {
      id: "estado",
      label: "Estado",
      minWidth: 120,
      align: "center",
      value: (record) => record.estado,
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 100,
      align: "center",
      render: (record) => (
        <Tooltip title="Editar registro">
          <IconButton
            size="small"
            aria-label={`Editar registro ${record.nombre}`}
            onClick={() => {
              void navigate(`${BASIC_CATALOG_PATH}/${record.id}/edit${query}`);
            }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={catalog.nombre}
        description={`Administración de las opciones de ${catalog.nombre} disponibles en el sistema.`}
        actions={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() => {
              void navigate(`${BASIC_CATALOG_PATH}/new${query}`);
            }}
          >
            Nuevo registro
          </AppButton>
        }
      />
      {isError ? (
        <Alert
          severity="error"
          action={<Button onClick={() => void refetch()}>Reintentar</Button>}
        >
          No fue posible cargar los registros.
        </Alert>
      ) : (
        <DataTable
          columns={columns}
          rows={records}
          getRowId={(record) => record.id}
          loading={isLoading}
          emptyMessage="No se encontraron registros"
          ariaLabel={`Lista de ${catalog.nombre}`}
        />
      )}
      {(creating || id !== undefined) && (
        <CatalogEditor
          key={creating ? "new" : id}
          catalog={catalog}
          recordId={id === undefined ? undefined : Number(id)}
          onClose={() => void navigate(listPath)}
        />
      )}
    </>
  );
}

function CatalogEditor({
  catalog,
  recordId,
  onClose,
}: {
  catalog: BasicCatalog;
  recordId?: number;
  onClose: () => void;
}) {
  const api = basicCatalogApi[catalog.id];
  const queryClient = useQueryClient();
  const editing = recordId !== undefined;
  const validId =
    recordId !== undefined && Number.isSafeInteger(recordId) && recordId > 0;
  const recordQuery = useQuery({
    queryKey: [...getBasicCatalogQueryKey(catalog.id), recordId],
    queryFn: () => {
      if (!validId) {
        throw new Error("ID de registro inválido.");
      }
      return api.getById(recordId);
    },
    enabled: validId,
  });
  const statesQuery = useGetAllEstados();
  const save = useMutation({
    mutationFn: (request: Request) =>
      recordId === undefined
        ? api.create(request)
        : api.update(recordId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: getBasicCatalogQueryKey(catalog.id),
      });
      onClose();
    },
  });
  const loadError =
    statesQuery.isError || (editing && (!validId || recordQuery.isError));
  const loading = statesQuery.isLoading || (editing && recordQuery.isLoading);

  return (
    <Dialog
      open
      onClose={save.isPending ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {editing ? "Editar" : "Nuevo registro"}: {catalog.nombre}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {loadError ? (
            <>
              <Alert severity="error">
                No fue posible cargar la información del formulario.
              </Alert>
              <Button onClick={onClose}>Cerrar</Button>
            </>
          ) : loading ? (
            <CircularProgress aria-label="Cargando formulario" />
          ) : (
            <>
              {save.isError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  No fue posible guardar los cambios. Verifique la información e
                  inténtelo nuevamente.
                </Alert>
              )}
              <CatalogForm
                initialData={editing ? recordQuery.data : undefined}
                states={statesQuery.data ?? []}
                loading={save.isPending}
                onSubmit={(request) => save.mutate(request)}
                onCancel={onClose}
              />
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export function LegacyCatalogRedirect({
  catalogId,
  creating = false,
}: {
  catalogId: BasicCatalog["id"];
  creating?: boolean;
}) {
  const { id } = useParams();
  const suffix = creating ? "/new" : id === undefined ? "" : `/${id}/edit`;
  return (
    <Navigate
      to={`${BASIC_CATALOG_PATH}${suffix}?catalog=${catalogId}`}
      replace
    />
  );
}
