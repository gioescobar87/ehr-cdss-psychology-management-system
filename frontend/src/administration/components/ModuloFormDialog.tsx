import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

import FormTextField from "../../shared/components/forms/FormTextField";

import {
  schema,
  type FormInput,
  type FormValues,
} from "../schemas/modulo.schema";

import { useCreate, useUpdate } from "../hooks/useModulo";

import type { Response, Request } from "../types/modulo.types";

interface ModuloFormDialogProps {
  open: boolean;
  editingModulo?: Response | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ModuloFormDialog({
  open,
  editingModulo,
  onClose,
  onSuccess,
}: ModuloFormDialogProps) {
  const createModulo = useCreate();
  const updateModulo = useUpdate();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = !!editingModulo;

  const { control, handleSubmit, reset, formState } = useForm<
    FormInput,
    unknown,
    FormValues
  >({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      icono: "",
      orden: 1,
    },
  });

  const isSaving =
    formState.isSubmitting || createModulo.isPending || updateModulo.isPending;

  /*
   * Synchronize the form with the module being edited.
   *
   * reset() updates React Hook Form's internal state and does not
   * introduce additional local React state.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditing && editingModulo) {
      reset({
        nombre: editingModulo.nombre,
        descripcion: editingModulo.descripcion ?? "",
        icono: editingModulo.icono ?? "",
        orden: editingModulo.orden,
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
        icono: "",
        orden: 1,
      });
    }
  }, [open, isEditing, editingModulo, reset]);

  const handleFormSubmit = async (values: FormValues) => {
    setSubmitError(null);

    const request: Request = {
      nombre: values.nombre,
      descripcion: values.descripcion || null,
      icono: values.icono || null,
      orden: values.orden,
    };

    try {
      if (isEditing && editingModulo) {
        await updateModulo.mutateAsync({
          id: editingModulo.id,
          request,
        });
      } else {
        await createModulo.mutateAsync(request);
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Failed to save module:", error);

      setSubmitError(
        "No fue posible guardar los cambios. Verifique la información e inténtelo nuevamente.",
      );
    }
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    setSubmitError(null);
    onClose();
  };

  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{isEditing ? "Editar módulo" : "Nuevo módulo"}</DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          {!isEditing && (
            <Alert severity="info">
              El módulo se creará con el estado predeterminado establecido por
              el sistema.
            </Alert>
          )}

          <Box sx={{ display: "grid", gap: 2 }}>
            <FormTextField
              name="nombre"
              control={control}
              label="Nombre"
              required
              disabled={isSaving}
              fullWidth
            />

            <FormTextField
              name="descripcion"
              control={control}
              label="Descripción"
              multiline
              minRows={3}
              disabled={isSaving}
              fullWidth
            />

            <FormTextField
              name="icono"
              control={control}
              label="Icono"
              helperText="Nombre del icono de Material Icons (ej. 'shield', 'people')."
              disabled={isSaving}
              fullWidth
            />

            <FormTextField
              name="orden"
              control={control}
              label="Orden"
              type="number"
              disabled={isSaving}
              fullWidth
            />
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit(handleFormSubmit, (errors) => {
            console.error("MODULE FORM VALIDATION FAILED:", errors);
          })}
          variant="contained"
          disabled={isSaving || hasErrors}
        >
          {isSaving ? "Procesando..." : isEditing ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
