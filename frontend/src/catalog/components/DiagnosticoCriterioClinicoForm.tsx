import { useEffect } from "react";
import { Alert, Box, CircularProgress } from "@mui/material";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import FormActions from "../../shared/components/forms/FormActions";
import FormSelect from "../../shared/components/forms/FormSelect";
import FormTextField from "../../shared/components/forms/FormTextField";
import FormContainer from "../../shared/components/forms/FormContainer";
import {
  getClinicalCriteria,
  getDiagnoses,
} from "../api/diagnosisClinicalCriterionApi";
import {
  diagnosticoCriterioClinicoSchema,
  type DiagnosticoCriterioClinicoFormValues,
} from "../schemas/diagnosticoCriterioClinico.schema";
import type {
  DiagnosticoCriterioClinico,
  DiagnosticoCriterioClinicoRequest,
} from "../types/diagnosticCatalog.types";

interface Props {
  initialData?: DiagnosticoCriterioClinico;
  loading?: boolean;
  onSubmit: (request: DiagnosticoCriterioClinicoRequest) => void;
  onCancel: () => void;
}

export default function DiagnosticoCriterioClinicoForm({
  initialData,
  loading = false,
  onSubmit,
  onCancel,
}: Props) {
  const diagnosesQuery = useQuery({
    queryKey: ["diagnoses"],
    queryFn: getDiagnoses,
  });
  const criteriaQuery = useQuery({
    queryKey: ["clinical-criteria"],
    queryFn: getClinicalCriteria,
  });
  const { control, handleSubmit, reset } =
    useForm<DiagnosticoCriterioClinicoFormValues>({
      resolver: zodResolver(diagnosticoCriterioClinicoSchema),
      defaultValues: {
        diagnosticoId: 0,
        criterioClinicoId: 0,
        referenciaRegla: "",
      },
    });

  useEffect(() => {
    if (initialData) {
      reset({
        diagnosticoId: initialData.diagnosticoId,
        criterioClinicoId: initialData.criterioClinicoId,
        referenciaRegla: initialData.referenciaRegla ?? "",
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (values: DiagnosticoCriterioClinicoFormValues) => {
    onSubmit({
      diagnosticoId: values.diagnosticoId,
      criterioClinicoId: values.criterioClinicoId,
      referenciaRegla: values.referenciaRegla || null,
    });
  };
  const loadError = diagnosesQuery.isError || criteriaQuery.isError;
  const loadingReferences = diagnosesQuery.isLoading || criteriaQuery.isLoading;

  if (loadError) {
    return (
      <Alert severity="error">
        No fue posible cargar los diagnósticos o criterios clínicos.
      </Alert>
    );
  }
  if (loadingReferences) {
    return <CircularProgress aria-label="Cargando opciones" />;
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
          name="criterioClinicoId"
          control={control}
          label="Criterio clínico"
          options={(criteriaQuery.data ?? []).map((item) => ({
            value: item.id,
            label: item.nombre,
          }))}
          disabled={loading}
        />
        <FormTextField
          name="referenciaRegla"
          control={control}
          label="Referencia de regla"
          inputProps={{ maxLength: 1 }}
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
