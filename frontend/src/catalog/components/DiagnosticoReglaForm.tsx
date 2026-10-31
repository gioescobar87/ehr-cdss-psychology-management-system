import { useEffect } from "react";
import { Alert, Box, CircularProgress, TextField } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";

import FormActions from "../../shared/components/forms/FormActions";
import FormSelect from "../../shared/components/forms/FormSelect";
import FormTextField from "../../shared/components/forms/FormTextField";
import FormContainer from "../../shared/components/forms/FormContainer";
import { getDiagnoses } from "../api/diagnosisClinicalCriterionApi";
import {
  diagnosticoReglaSchema,
  type DiagnosticoReglaFormValues,
} from "../schemas/diagnosticoRegla.schema";
import { operatorOptions, ruleTypeOptions } from "../diagnosticCatalogs";
import type {
  DiagnosticoRegla,
  DiagnosticoReglaRequest,
} from "../types/diagnosticCatalog.types";

interface Props {
  initialData?: DiagnosticoRegla;
  loading?: boolean;
  onSubmit: (request: DiagnosticoReglaRequest) => void;
  onCancel: () => void;
}

export default function DiagnosticoReglaForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const diagnosesQuery = useQuery({
    queryKey: ["diagnoses"],
    queryFn: getDiagnoses,
  });
  const { control, handleSubmit, reset } = useForm<DiagnosticoReglaFormValues>({
    resolver: zodResolver(diagnosticoReglaSchema),
    defaultValues: {
      diagnosticoId: 0,
      tipoReglaId: 0,
      valorRegla: 0,
      operadorId: 0,
      parametro: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        diagnosticoId: initialData.diagnosticoId,
        tipoReglaId: initialData.tipoReglaId,
        valorRegla: initialData.valorRegla,
        operadorId: initialData.operadorId,
        parametro: initialData.parametro ?? "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (values: DiagnosticoReglaFormValues) => {
    onSubmit({
      ...values,
      parametro: values.parametro ?? "",
    });
  };

  if (diagnosesQuery.isError) {
    return (
      <Alert severity="error">
        No fue posible cargar la lista de diagnósticos.
      </Alert>
    );
  }
  if (diagnosesQuery.isLoading) {
    return <CircularProgress aria-label="Cargando diagnósticos" />;
  }

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <Box sx={{ display: "grid", gap: 2 }}>
        <FormSelect
          name="diagnosticoId"
          control={control}
          label="Diagnóstico"
          options={(diagnosesQuery.data ?? []).map((item) => ({
            value: item.id,
            label: item.nombre,
          }))}
          disabled={loading}
        />
        <FormSelect
          name="tipoReglaId"
          control={control}
          label="Tipo de regla"
          options={ruleTypeOptions.map((item) => ({
            value: item.id,
            label: item.nombre,
          }))}
          disabled={loading}
        />
        <Controller
          name="valorRegla"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="Valor de regla"
              type="number"
              inputProps={{ step: 1 }}
              disabled={loading}
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
              onChange={(event) =>
                field.onChange(
                  event.target.value === "" ? 0 : Number(event.target.value),
                )
              }
            />
          )}
        />
        <FormSelect
          name="operadorId"
          control={control}
          label="Operador"
          options={operatorOptions.map((item) => ({
            value: item.id,
            label: item.nombre,
          }))}
          disabled={loading}
        />
        <FormTextField
          name="parametro"
          control={control}
          label="Parámetro"
          multiline
          minRows={2}
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
