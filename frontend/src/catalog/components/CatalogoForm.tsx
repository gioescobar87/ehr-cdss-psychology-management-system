import { useEffect } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Box } from "@mui/material";

import FormContainer from "../../shared/components/forms/FormContainer";
import FormTextField from "../../shared/components/forms/FormTextField";
import FormSelect from "../../shared/components/forms/FormSelect";
import FormActions from "../../shared/components/forms/FormActions";

import { schema, type FormValues } from "../schemas/catalogo.schema";

import type { Response, Request } from "../types/catalogDTOs.types";

interface FormProps {
  initialData?: Response;
  states: {
    id: number;
    nombre: string;
  }[];
  loading?: boolean;
  onSubmit: (request: Request) => void;
  onCancel: () => void;
}

export default function CatalogForm({
  initialData,
  states,
  loading = false,
  onSubmit,
  onCancel,
}: FormProps) {
  const { control, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),

    defaultValues: {
      nombre: "",
      descripcion: "",
      estadoId: 0,
    },
  });

  useEffect(() => {
    if (!initialData) {
      return;
    }

    reset({
      nombre: initialData.nombre,
      descripcion: initialData.descripcion ?? "",
      estadoId: initialData.estadoId,
    });
  }, [initialData, reset]);

  const handleFormSubmit = (values: FormValues) => {
    onSubmit({
      nombre: values.nombre,
      descripcion: values.descripcion || null,
      estadoId: values.estadoId,
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit(handleFormSubmit)}>
      <Box
        sx={{
          display: "grid",
          gap: 2,
        }}
      >
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
          name="estadoId"
          control={control}
          label="Estado"
          options={states.map((state) => ({
            value: state.id,
            label: state.nombre,
          }))}
          disabled={loading}
        />
      </Box>

      <FormActions
        onCancel={onCancel}
        submitText={initialData ? "Actualizar" : "Crear"}
        cancelText="Cancelar"
        loading={loading}
      />
    </FormContainer>
  );
}
