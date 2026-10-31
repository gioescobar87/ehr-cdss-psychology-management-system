import { useEffect } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import FormActions from "../../shared/components/forms/FormActions";
import FormContainer from "../../shared/components/forms/FormContainer";
import FormSelect from "../../shared/components/forms/FormSelect";
import FormTextField from "../../shared/components/forms/FormTextField";
import { getAll as getDiagnosticCategories } from "../api/categoriaDiagnosticaApi";
import {
  diagnosticoSchema,
  type DiagnosticoFormValues,
} from "../schemas/diagnostico.schema";
import type {
  Diagnostico,
  DiagnosticoRequest,
} from "../types/diagnosisCatalog.types";

interface Props {
  initialData?: Diagnostico;
  loading?: boolean;
  onSubmit: (request: DiagnosticoRequest) => void;
  onCancel: () => void;
}

export default function DiagnosticoForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const categoriesQuery = useQuery({
    queryKey: ["categoria-diagnostica"],
    queryFn: getDiagnosticCategories,
  });
  const { control, handleSubmit, reset } = useForm<DiagnosticoFormValues>({
    resolver: zodResolver(diagnosticoSchema),
    defaultValues: {
      nombre: "",
      codigoIcd: "",
      descripcion: "",
      categoriaDiagnosticaId: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        codigoIcd: initialData.codigoIcd ?? "",
        descripcion: initialData.descripcion ?? "",
        categoriaDiagnosticaId: initialData.categoriaDiagnosticaId,
      });
    }
  }, [initialData, reset]);

  if (categoriesQuery.isError) {
    return (
      <Alert severity="error">
        No fue posible cargar las categorías diagnósticas.
      </Alert>
    );
  }
  if (categoriesQuery.isLoading) {
    return <CircularProgress aria-label="Cargando categorías" />;
  }

  return (
    <FormContainer
      onSubmit={handleSubmit((values) =>
        onSubmit({
          nombre: values.nombre,
          codigoIcd: values.codigoIcd || null,
          descripcion: values.descripcion || null,
          categoriaDiagnosticaId: values.categoriaDiagnosticaId,
        }),
      )}
    >
      <Box sx={{ display: "grid", gap: 2 }}>
        <FormTextField
          name="nombre"
          control={control}
          label="Nombre"
          required
          disabled={loading}
        />
        <FormTextField
          name="codigoIcd"
          control={control}
          label="Código ICD-10-CM"
          inputProps={{ maxLength: 50 }}
          disabled={loading}
        />
        <FormTextField
          name="descripcion"
          control={control}
          label="Descripción"
          multiline
          minRows={3}
          disabled={loading}
        />
        <FormSelect
          name="categoriaDiagnosticaId"
          control={control}
          label="Categoría diagnóstica"
          options={(categoriesQuery.data ?? []).map((category) => ({
            value: category.id,
            label: category.nombre,
          }))}
          disabled={loading}
        />
      </Box>
      <FormActions
        onCancel={onCancel}
        submitText={initialData ? "Actualizar" : "Crear"}
        loading={loading}
      />
    </FormContainer>
  );
}
