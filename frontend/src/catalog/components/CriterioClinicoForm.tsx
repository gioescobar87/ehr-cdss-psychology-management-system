import { useEffect } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import FormActions from "../../shared/components/forms/FormActions";
import FormContainer from "../../shared/components/forms/FormContainer";
import FormSelect from "../../shared/components/forms/FormSelect";
import FormTextField from "../../shared/components/forms/FormTextField";
import { getAll as getCriterionCategories } from "../api/categoriaCriterioClinicoApi";
import {
  criterioClinicoSchema,
  type CriterioClinicoFormValues,
} from "../schemas/criterioClinico.schema";
import type {
  CriterioClinico,
  CriterioClinicoRequest,
} from "../types/clinicalCriterionCatalog.types";

interface Props {
  initialData?: CriterioClinico;
  loading?: boolean;
  onSubmit: (request: CriterioClinicoRequest) => void;
  onCancel: () => void;
}

export default function CriterioClinicoForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const categoriesQuery = useQuery({
    queryKey: ["categoria-criterio-clinico"],
    queryFn: getCriterionCategories,
  });
  const { control, handleSubmit, reset } = useForm<CriterioClinicoFormValues>({
    resolver: zodResolver(criterioClinicoSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      categoriaCriterioClinicoId: 0,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        nombre: initialData.nombre,
        descripcion: initialData.descripcion ?? "",
        categoriaCriterioClinicoId: initialData.categoriaCriterioClinicoId,
      });
    }
  }, [initialData, reset]);

  if (categoriesQuery.isError) {
    return (
      <Alert severity="error">
        No fue posible cargar las categorías de criterios clínicos.
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
          descripcion: values.descripcion || null,
          categoriaCriterioClinicoId: values.categoriaCriterioClinicoId,
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
          name="descripcion"
          control={control}
          label="Descripción"
          multiline
          minRows={3}
          disabled={loading}
        />
        <FormSelect
          name="categoriaCriterioClinicoId"
          control={control}
          label="Categoría de criterio clínico"
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
