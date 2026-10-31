
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import type { ReactNode } from "react";

import AppButton from "../../shared/components/common/AppButton";
import PageHeader from "../../shared/components/common/PageHeader";
import type { DataTableColumn } from "../../shared/components/tables/DataTable.types";
import CriterioClinicoForm from "../components/CriterioClinicoForm";
import DiagnosticoForm from "../components/DiagnosticoForm";
import DiagnosticoCriterioClinicoForm from "../components/DiagnosticoCriterioClinicoForm";
import DiagnosticoReglaForm from "../components/DiagnosticoReglaForm";
import * as associationApi from "../api/diagnosisClinicalCriterionApi";
import * as criterioClinicoApi from "../api/criterioClinicoApi";
import * as diagnosticoApi from "../api/diagnosticoApi";
import * as ruleApi from "../api/diagnosisRuleApi";
import {
  type CatalogStatusFilter,
  diagnosticCatalogQueryKey,
  diagnosticCatalogs,
  DIAGNOSTIC_CATALOG_PATH,
} from "../diagnosticCatalogs";
import type {
  CriterioClinico,
  CriterioClinicoRequest,
} from "../types/clinicalCriterionCatalog.types";
import type {
  Diagnostico,
  DiagnosticoRequest,
} from "../types/diagnosisCatalog.types";
import type {
  DiagnosticoCriterioClinico,
  DiagnosticoCriterioClinicoRequest,
  DiagnosticoRegla,
  DiagnosticoReglaRequest,
} from "../types/diagnosticCatalog.types";

interface PageProps {
  creating?: boolean;
}

interface CatalogCrudApi<RecordType, RequestType> {
  getAll: () => Promise<RecordType[]>;
  getById: (id: number) => Promise<RecordType>;
  create: (request: RequestType) => Promise<RecordType>;
  update: (id: number, request: RequestType) => Promise<RecordType>;
  remove: (id: number) => Promise<void>;
}

type SortDirection = "asc" | "desc";

interface SortConfiguration {
  columnId: string;
  direction: SortDirection;
}

/**
 * Sortable table used by the diagnostic catalogs.
 * Clicking a column header changes its sorting direction.
 * Columns without a value function, such as Actions, are not sortable.
 */
function SortableDataTable<T>({
  columns,
  rows,
  getRowId,
  loading,
  emptyMessage,
  ariaLabel,
}: {
  columns: DataTableColumn<T>[];
  rows: T[];
  getRowId: (record: T) => string | number;
  loading: boolean;
  emptyMessage: string;
  ariaLabel: string;
}) {
  const [sort, setSort] = useState<SortConfiguration | null>(null);

  const sortedRows = (() => {
    if (!sort) {
      return rows;
    }

    const sortColumn = columns.find(
      (column) => column.id === sort.columnId,
    );

    if (!sortColumn?.value) {
      return rows;
    }

    const collator = new Intl.Collator(undefined, {
      numeric: true,
      sensitivity: "base",
    });

    return [...rows].sort((a, b) => {
      const aValue = sortColumn.value!(a);
      const bValue = sortColumn.value!(b);

      let comparison = 0;

      if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = collator.compare(
          aValue == null ? "" : String(aValue),
          bValue == null ? "" : String(bValue),
        );
      }

      return sort.direction === "asc" ? comparison : -comparison;
    });
  })();

  const handleSort = (columnId: string) => {
    setSort((previous) => ({
      columnId,
      direction:
        previous?.columnId === columnId && previous.direction === "asc"
          ? "desc"
          : "asc",
    }));
  };

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" aria-label={ariaLabel}>
        <TableHead>
          <TableRow>
            {columns.map((column) => {
              const sortable = column.value !== undefined;
              const active = sort?.columnId === column.id;

              return (
                <TableCell
                  key={column.id}
                  align={column.align ?? "left"}
                  sortDirection={active ? sort.direction : false}
                  sx={{
                    minWidth: column.minWidth,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                  }}
                >
                  {sortable ? (
                    <TableSortLabel
                      active={active}
                      direction={active ? sort.direction : "asc"}
                      onClick={() => handleSort(column.id)}
                    >
                      {column.label}
                    </TableSortLabel>
                  ) : (
                    column.label
                  )}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={columns.length} align="center">
                <CircularProgress size={28} sx={{ my: 2 }} />
              </TableCell>
            </TableRow>
          ) : sortedRows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                align="center"
                sx={{ py: 4 }}
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            sortedRows.map((record, index) => (
              <TableRow key={getRowId(record)} hover>
                {columns.map((column) => (
                  <TableCell key={column.id} align={column.align ?? "left"}>
                    {column.render
                      ? column.render(record, index)
                      : column.value?.(record) ?? "-"}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const diagnosticoColumns: DataTableColumn<Diagnostico>[] = [
  {
    id: "categoria",
    label: "Categoría diagnóstica",
    minWidth: 200,
    value: (record) => record.categoriaDiagnostica,
  },
  {
    id: "codigoIcd",
    label: "Código DSM",
    minWidth: 150,
    value: (record) => record.codigoIcd ?? "-",
  },
  {
    id: "nombre",
    label: "Nombre",
    minWidth: 200,
    value: (record) => record.nombre,
  },
  {
    id: "descripcion",
    label: "Descripción",
    minWidth: 240,
    value: (record) => record.descripcion ?? "-",
  },
  {
    id: "estado",
    label: "Estado",
    minWidth: 110,
    align: "center",
    value: (record) => record.estado,
  },
];

const criterioClinicoColumns: DataTableColumn<CriterioClinico>[] = [
  {
    id: "categoria",
    label: "Categoría",
    minWidth: 220,
    value: (record) => record.categoriaCriterioClinico,
  },
  {
    id: "nombre",
    label: "Nombre",
    minWidth: 220,
    value: (record) => record.nombre,
  },
  {
    id: "descripcion",
    label: "Descripción",
    minWidth: 260,
    value: (record) => record.descripcion ?? "-",
  },
  {
    id: "estado",
    label: "Estado",
    minWidth: 110,
    align: "center",
    value: (record) => record.estado,
  },
];

function EntityCatalogWorkspace<
  RecordType extends { id: number; estado: string },
  RequestType,
>({
  creating,
  catalogId,
  title,
  description,
  api,
  columns,
  emptyMessage,
  ariaLabel,
  renderForm,
}: {
  creating: boolean;
  catalogId: "diagnostico" | "criterio-clinico";
  title: string;
  description: string;
  api: CatalogCrudApi<RecordType, RequestType>;
  columns: DataTableColumn<RecordType>[];
  emptyMessage: string;
  ariaLabel: string;
  renderForm: (
    initialData: RecordType | undefined,
    loading: boolean,
    onSubmit: (request: RequestType) => void,
    onCancel: () => void,
  ) => ReactNode;
}) {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const queryKey = diagnosticCatalogQueryKey(catalogId);
  const listPath = `${DIAGNOSTIC_CATALOG_PATH}?catalog=${catalogId}`;
  const recordId = parseRecordId(id);
  const requestedRecordId = recordId ?? 0;

  const [statusFilter, setStatusFilter] =
    useState<CatalogStatusFilter>("all");
  const [deleting, setDeleting] = useState<number>();

  const recordsQuery = useQuery({ queryKey, queryFn: api.getAll });

  const recordQuery = useQuery({
    queryKey: [...queryKey, recordId],
    queryFn: () => api.getById(requestedRecordId),
    enabled: recordId !== undefined,
  });

  const save = useMutation({
    mutationFn: (request: RequestType) =>
      recordId === undefined
        ? api.create(request)
        : api.update(recordId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      invalidateRelatedDiagnosticQueries(queryClient, catalogId);
      void navigate(listPath);
    },
  });

  const remove = useMutation({
    mutationFn: api.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      invalidateRelatedDiagnosticQueries(queryClient, catalogId);
      setDeleting(undefined);
    },
  });

  const hasStatusColumn = columns.some(
    (column) => column.label === "Estado",
  );

  const filteredRecords = (recordsQuery.data ?? []).filter((record) => {
    if (statusFilter === "all") {
      return true;
    }

    const active = record.estado.trim().toLocaleUpperCase() === "ACTIVO";

    return statusFilter === "active" ? active : !active;
  });

  const editing = recordId !== undefined;
  const editorOpen = creating || id !== undefined;
  const editorLoading = editing && recordQuery.isLoading;

  const editorError =
    editing &&
    (recordId === undefined || recordQuery.isError || !recordQuery.data);

  const tableColumns: DataTableColumn<RecordType>[] = [
    ...columns,
    {
      id: "actions",
      label: "Acciones",
      minWidth: 110,
      align: "center",
      render: (record) => (
        <>
          <Tooltip title={`Editar ${title.toLocaleLowerCase()}`}>
            <IconButton
              size="small"
              aria-label={`Editar ${title.toLocaleLowerCase()} ${record.id}`}
              onClick={() =>
                void navigate(
                  `${DIAGNOSTIC_CATALOG_PATH}/${record.id}/edit?catalog=${catalogId}`,
                )
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title={`Eliminar ${title.toLocaleLowerCase()}`}>
            <IconButton
              size="small"
              aria-label={`Eliminar ${title.toLocaleLowerCase()} ${record.id}`}
              onClick={() => setDeleting(record.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        actions={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() =>
              void navigate(
                `${DIAGNOSTIC_CATALOG_PATH}/new?catalog=${catalogId}`,
              )
            }
          >
            Nuevo registro
          </AppButton>
        }
      />

      {hasStatusColumn && (
        <Box sx={{ mb: 2 }}>
          <ToggleButtonGroup
            exclusive
            size="small"
            value={statusFilter}
            aria-label="Filtrar por estado"
            onChange={(_, value: CatalogStatusFilter | null) => {
              if (value) {
                setStatusFilter(value);
              }
            }}
          >
            <ToggleButton value="active">Activos</ToggleButton>
            <ToggleButton value="inactive">Inactivos</ToggleButton>
            <ToggleButton value="all">Todos</ToggleButton>
          </ToggleButtonGroup>
        </Box>
      )}

      {recordsQuery.isError ? (
        <Alert
          severity="error"
          action={
            <Button onClick={() => void recordsQuery.refetch()}>
              Reintentar
            </Button>
          }
        >
          No fue posible cargar los registros.
        </Alert>
      ) : (
        <SortableDataTable
          columns={tableColumns}
          rows={filteredRecords}
          getRowId={(record) => record.id}
          loading={recordsQuery.isLoading}
          emptyMessage={emptyMessage}
          ariaLabel={ariaLabel}
        />
      )}

      {editorOpen && (
        <Dialog
          open
          onClose={save.isPending ? undefined : () => void navigate(listPath)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editing ? `Editar: ${title}` : `Nuevo registro: ${title}`}
          </DialogTitle>

          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {editorLoading ? (
                <CircularProgress aria-label="Cargando registro" />
              ) : editorError ? (
                <Alert severity="error">
                  No fue posible cargar el registro solicitado.
                </Alert>
              ) : (
                <>
                  {save.isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      No fue posible guardar los cambios. Verifique la
                      información e inténtelo nuevamente.
                    </Alert>
                  )}

                  {renderForm(
                    editing ? recordQuery.data : undefined,
                    save.isPending,
                    (request) => save.mutate(request),
                    () => void navigate(listPath),
                  )}
                </>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <DeleteConfirmation
        open={deleting !== undefined}
        loading={remove.isPending}
        error={remove.isError}
        onCancel={() => {
          if (!remove.isPending) {
            setDeleting(undefined);
            remove.reset();
          }
        }}
        onConfirm={() => {
          if (deleting !== undefined) {
            remove.mutate(deleting);
          }
        }}
        entity="el registro"
      />
    </>
  );
}

export default function DiagnosticCatalogPage({
  creating = false,
}: PageProps) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const selectedId = searchParams.get("catalog") ?? diagnosticCatalogs[0].id;

  const selectedCatalog = diagnosticCatalogs.find(
    (catalog) => catalog.id === selectedId,
  );

  return (
    <>
      <Box sx={{ mb: 3, maxWidth: 520 }}>
        <TextField
          select
          fullWidth
          label="Catálogo"
          value={selectedCatalog?.id ?? ""}
          onChange={(event) => {
            void navigate(
              `${DIAGNOSTIC_CATALOG_PATH}?catalog=${event.target.value}`,
            );
          }}
        >
          {diagnosticCatalogs.map((catalog) => (
            <MenuItem key={catalog.id} value={catalog.id}>
              {catalog.nombre}
            </MenuItem>
          ))}
        </TextField>
      </Box>

      {selectedCatalog ? (
        selectedCatalog.id === "diagnostico" ? (
          <EntityCatalogWorkspace<Diagnostico, DiagnosticoRequest>
            key={selectedCatalog.id}
            creating={creating}
            catalogId="diagnostico"
            title={selectedCatalog.nombre}
            description="Administre los diagnósticos clínicos disponibles."
            api={diagnosticoApi}
            columns={diagnosticoColumns}
            emptyMessage="No se encontraron diagnósticos."
            ariaLabel="Diagnósticos clínicos"
            renderForm={(initialData, loading, onSubmit, onCancel) => (
              <DiagnosticoForm
                initialData={initialData}
                loading={loading}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
            )}
          />
        ) : selectedCatalog.id === "criterio-clinico" ? (
          <EntityCatalogWorkspace<CriterioClinico, CriterioClinicoRequest>
            key={selectedCatalog.id}
            creating={creating}
            catalogId="criterio-clinico"
            title={selectedCatalog.nombre}
            description="Administre los criterios clínicos que se utilizan en las evaluaciones."
            api={criterioClinicoApi}
            columns={criterioClinicoColumns}
            emptyMessage="No se encontraron criterios clínicos."
            ariaLabel="Criterios clínicos"
            renderForm={(initialData, loading, onSubmit, onCancel) => (
              <CriterioClinicoForm
                initialData={initialData}
                loading={loading}
                onSubmit={onSubmit}
                onCancel={onCancel}
              />
            )}
          />
        ) : selectedCatalog.id === "diagnostico-criterio-clinico" ? (
          <AssociationWorkspace creating={creating} />
        ) : (
          <RuleWorkspace creating={creating} />
        )
      ) : (
        <Alert severity="error">
          El catálogo solicitado no existe o no tiene permiso para
          administrarlo.
        </Alert>
      )}
    </>
  );
}

function AssociationWorkspace({ creating }: PageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const catalogId = "diagnostico-criterio-clinico";
  const catalog = diagnosticCatalogs[0];
  const queryKey = diagnosticCatalogQueryKey(catalogId);
  const listPath = `${DIAGNOSTIC_CATALOG_PATH}?catalog=${catalogId}`;

  const recordId = parseRecordId(id);
  const requestedRecordId = recordId ?? 0;

  const recordsQuery = useQuery({
    queryKey,
    queryFn: associationApi.getAll,
  });

  const diagnosesQuery = useQuery({
    queryKey: ["diagnoses"],
    queryFn: associationApi.getDiagnoses,
  });

  const [diagnosticoFilter, setDiagnosticoFilter] = useState("");
  const [deleting, setDeleting] = useState<number>();

  const recordQuery = useQuery({
    queryKey: [...queryKey, recordId],
    queryFn: () => associationApi.getById(requestedRecordId),
    enabled: recordId !== undefined,
  });

  const save = useMutation({
    mutationFn: (request: DiagnosticoCriterioClinicoRequest) =>
      recordId === undefined
        ? associationApi.create(request)
        : associationApi.update(recordId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      void navigate(listPath);
    },
  });

  const remove = useMutation({
    mutationFn: associationApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      setDeleting(undefined);
    },
  });

  const columns: DataTableColumn<DiagnosticoCriterioClinico>[] = [
    {
      id: "diagnostico",
      label: "Diagnóstico",
      minWidth: 220,
      value: (record) => record.diagnostico,
    },
    {
      id: "criterio",
      label: "Criterio clínico",
      minWidth: 260,
      value: (record) => record.criterioClinico,
    },
    {
      id: "referencia",
      label: "Referencia",
      minWidth: 110,
      align: "center",
      value: (record) => record.referenciaRegla ?? "-",
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 110,
      align: "center",
      render: (record) => (
        <>
          <Tooltip title="Editar asociación">
            <IconButton
              size="small"
              aria-label={`Editar asociación ${record.id}`}
              onClick={() =>
                void navigate(
                  `${DIAGNOSTIC_CATALOG_PATH}/${record.id}/edit?catalog=${catalogId}`,
                )
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar asociación">
            <IconButton
              size="small"
              aria-label={`Eliminar asociación ${record.id}`}
              onClick={() => setDeleting(record.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const filteredRecords = (recordsQuery.data ?? []).filter(
    (record) =>
      diagnosticoFilter === "" ||
      record.diagnosticoId === Number(diagnosticoFilter),
  );

  const editing = recordId !== undefined;
  const editorOpen = creating || id !== undefined;
  const editorLoading = editing && recordQuery.isLoading;

  const editorError =
    editing &&
    (recordId === undefined || recordQuery.isError || !recordQuery.data);

  return (
    <>
      <PageHeader
        title={catalog.nombre}
        description="Administre las asociaciones entre diagnósticos y criterios clínicos."
        actions={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() =>
              void navigate(
                `${DIAGNOSTIC_CATALOG_PATH}/new?catalog=${catalogId}`,
              )
            }
          >
            Nueva asociación
          </AppButton>
        }
      />

      <Box sx={{ mb: 2, maxWidth: 480 }}>
        {diagnosesQuery.isError ? (
          <Alert
            severity="error"
            action={
              <Button onClick={() => void diagnosesQuery.refetch()}>
                Reintentar
              </Button>
            }
          >
            No fue posible cargar los diagnósticos para el filtro.
          </Alert>
        ) : (
          <TextField
            select
            fullWidth
            label="Filtrar por diagnóstico"
            value={diagnosticoFilter}
            disabled={diagnosesQuery.isLoading}
            onChange={(event) => setDiagnosticoFilter(event.target.value)}
          >
            <MenuItem value="">Todos los diagnósticos</MenuItem>

            {(diagnosesQuery.data ?? []).map((diagnosis) => (
              <MenuItem key={diagnosis.id} value={diagnosis.id}>
                {diagnosis.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {recordsQuery.isError ? (
        <Alert
          severity="error"
          action={
            <Button onClick={() => void recordsQuery.refetch()}>
              Reintentar
            </Button>
          }
        >
          No fue posible cargar las asociaciones.
        </Alert>
      ) : (
        <SortableDataTable
          columns={columns}
          rows={filteredRecords}
          getRowId={(record) => record.id}
          loading={recordsQuery.isLoading}
          emptyMessage="No se encontraron asociaciones."
          ariaLabel="Asociaciones de diagnósticos y criterios clínicos"
        />
      )}

      {editorOpen && (
        <Dialog
          open
          onClose={save.isPending ? undefined : () => void navigate(listPath)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editing ? "Editar asociación" : "Nueva asociación"}
          </DialogTitle>

          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {editorLoading ? (
                <CircularProgress aria-label="Cargando asociación" />
              ) : editorError ? (
                <Alert severity="error">
                  No fue posible cargar la asociación solicitada.
                </Alert>
              ) : (
                <>
                  {save.isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      No fue posible guardar la asociación. Verifique la
                      información e inténtelo nuevamente.
                    </Alert>
                  )}

                  <DiagnosticoCriterioClinicoForm
                    initialData={editing ? recordQuery.data : undefined}
                    loading={save.isPending}
                    onSubmit={(request) => save.mutate(request)}
                    onCancel={() => void navigate(listPath)}
                  />
                </>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <DeleteConfirmation
        open={deleting !== undefined}
        loading={remove.isPending}
        error={remove.isError}
        onCancel={() => {
          if (!remove.isPending) {
            setDeleting(undefined);
            remove.reset();
          }
        }}
        onConfirm={() => {
          if (deleting !== undefined) {
            remove.mutate(deleting);
          }
        }}
        entity="la asociación"
      />
    </>
  );
}

function RuleWorkspace({ creating }: PageProps) {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();

  const catalogId = "diagnostico-regla";
  const catalog = diagnosticCatalogs[1];
  const queryKey = diagnosticCatalogQueryKey(catalogId);
  const listPath = `${DIAGNOSTIC_CATALOG_PATH}?catalog=${catalogId}`;

  const recordId = parseRecordId(id);
  const requestedRecordId = recordId ?? 0;

  const recordsQuery = useQuery({
    queryKey,
    queryFn: ruleApi.getAll,
  });

  const diagnosesQuery = useQuery({
    queryKey: ["diagnoses"],
    queryFn: associationApi.getDiagnoses,
  });

  const [diagnosticoFilter, setDiagnosticoFilter] = useState("");
  const [deleting, setDeleting] = useState<number>();

  const recordQuery = useQuery({
    queryKey: [...queryKey, recordId],
    queryFn: () => ruleApi.getById(requestedRecordId),
    enabled: recordId !== undefined,
  });

  const save = useMutation({
    mutationFn: (request: DiagnosticoReglaRequest) =>
      recordId === undefined
        ? ruleApi.create(request)
        : ruleApi.update(recordId, request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      void navigate(listPath);
    },
  });

  const remove = useMutation({
    mutationFn: ruleApi.remove,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey });
      setDeleting(undefined);
    },
  });

  const columns: DataTableColumn<DiagnosticoRegla>[] = [
    {
      id: "diagnostico",
      label: "Diagnóstico",
      minWidth: 220,
      value: (record) => record.diagnostico,
    },
    {
      id: "tipoRegla",
      label: "Tipo de regla",
      minWidth: 140,
      value: (record) => record.tipoRegla,
    },
    {
      id: "valor",
      label: "Valor",
      minWidth: 90,
      align: "center",
      value: (record) => record.valorRegla,
    },
    {
      id: "operador",
      label: "Operador",
      minWidth: 100,
      align: "center",
      value: (record) => record.operador,
    },
    {
      id: "parametro",
      label: "Parámetro",
      minWidth: 220,
      value: (record) => record.parametro ?? "-",
    },
    {
      id: "actions",
      label: "Acciones",
      minWidth: 110,
      align: "center",
      render: (record) => (
        <>
          <Tooltip title="Editar regla">
            <IconButton
              size="small"
              aria-label={`Editar regla ${record.id}`}
              onClick={() =>
                void navigate(
                  `${DIAGNOSTIC_CATALOG_PATH}/${record.id}/edit?catalog=${catalogId}`,
                )
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Eliminar regla">
            <IconButton
              size="small"
              aria-label={`Eliminar regla ${record.id}`}
              onClick={() => setDeleting(record.id)}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </>
      ),
    },
  ];

  const filteredRecords = (recordsQuery.data ?? []).filter(
    (record) =>
      diagnosticoFilter === "" ||
      record.diagnosticoId === Number(diagnosticoFilter),
  );

  const editing = recordId !== undefined;
  const editorOpen = creating || id !== undefined;
  const editorLoading = editing && recordQuery.isLoading;

  const editorError =
    editing &&
    (recordId === undefined || recordQuery.isError || !recordQuery.data);

  return (
    <>
      <PageHeader
        title={catalog.nombre}
        description="Administre las reglas de inferencia asociadas a los diagnósticos."
        actions={
          <AppButton
            startIcon={<AddIcon />}
            onClick={() =>
              void navigate(
                `${DIAGNOSTIC_CATALOG_PATH}/new?catalog=${catalogId}`,
              )
            }
          >
            Nueva regla
          </AppButton>
        }
      />

      <Box sx={{ mb: 2, maxWidth: 480 }}>
        {diagnosesQuery.isError ? (
          <Alert
            severity="error"
            action={
              <Button onClick={() => void diagnosesQuery.refetch()}>
                Reintentar
              </Button>
            }
          >
            No fue posible cargar los diagnósticos para el filtro.
          </Alert>
        ) : (
          <TextField
            select
            fullWidth
            label="Filtrar por diagnóstico"
            value={diagnosticoFilter}
            disabled={diagnosesQuery.isLoading}
            onChange={(event) => setDiagnosticoFilter(event.target.value)}
          >
            <MenuItem value="">Todos los diagnósticos</MenuItem>

            {(diagnosesQuery.data ?? []).map((diagnosis) => (
              <MenuItem key={diagnosis.id} value={diagnosis.id}>
                {diagnosis.nombre}
              </MenuItem>
            ))}
          </TextField>
        )}
      </Box>

      {recordsQuery.isError ? (
        <Alert
          severity="error"
          action={
            <Button onClick={() => void recordsQuery.refetch()}>
              Reintentar
            </Button>
          }
        >
          No fue posible cargar las reglas diagnósticas.
        </Alert>
      ) : (
        <SortableDataTable
          columns={columns}
          rows={filteredRecords}
          getRowId={(record) => record.id}
          loading={recordsQuery.isLoading}
          emptyMessage="No se encontraron reglas diagnósticas."
          ariaLabel="Reglas diagnósticas"
        />
      )}

      {editorOpen && (
        <Dialog
          open
          onClose={save.isPending ? undefined : () => void navigate(listPath)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {editing ? "Editar regla" : "Nueva regla"}
          </DialogTitle>

          <DialogContent>
            <Box sx={{ pt: 1 }}>
              {editorLoading ? (
                <CircularProgress aria-label="Cargando regla" />
              ) : editorError ? (
                <Alert severity="error">
                  No fue posible cargar la regla solicitada.
                </Alert>
              ) : (
                <>
                  {save.isError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      No fue posible guardar la regla. Verifique la información
                      e inténtelo nuevamente.
                    </Alert>
                  )}

                  <DiagnosticoReglaForm
                    initialData={editing ? recordQuery.data : undefined}
                    loading={save.isPending}
                    onSubmit={(request) => save.mutate(request)}
                    onCancel={() => void navigate(listPath)}
                  />
                </>
              )}
            </Box>
          </DialogContent>
        </Dialog>
      )}

      <DeleteConfirmation
        open={deleting !== undefined}
        loading={remove.isPending}
        error={remove.isError}
        onCancel={() => {
          if (!remove.isPending) {
            setDeleting(undefined);
            remove.reset();
          }
        }}
        onConfirm={() => {
          if (deleting !== undefined) {
            remove.mutate(deleting);
          }
        }}
        entity="la regla"
      />
    </>
  );
}

function DeleteConfirmation({
  open,
  loading,
  error,
  onCancel,
  onConfirm,
  entity,
}: {
  open: boolean;
  loading: boolean;
  error: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  entity: string;
}) {
  return (
    <Dialog open={open} onClose={loading ? undefined : onCancel}>
      <DialogTitle>Confirmar eliminación</DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              No fue posible eliminar {entity}. Puede existir información
              relacionada.
            </Alert>
          )}

          ¿Está seguro de que desea eliminar {entity}?
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>

        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          disabled={loading}
        >
          {loading ? "Eliminando..." : "Eliminar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function parseRecordId(id: string | undefined): number | undefined {
  if (id === undefined) {
    return undefined;
  }

  const parsed = Number(id);

  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function invalidateRelatedDiagnosticQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  catalogId: "diagnostico" | "criterio-clinico",
) {
  if (catalogId === "diagnostico") {
    void queryClient.invalidateQueries({ queryKey: ["diagnoses"] });

    void queryClient.invalidateQueries({
      queryKey: diagnosticCatalogQueryKey("diagnostico-criterio-clinico"),
    });

    void queryClient.invalidateQueries({
      queryKey: diagnosticCatalogQueryKey("diagnostico-regla"),
    });

    return;
  }

  void queryClient.invalidateQueries({ queryKey: ["clinical-criteria"] });

  void queryClient.invalidateQueries({
    queryKey: diagnosticCatalogQueryKey("diagnostico-criterio-clinico"),
  });
}
