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
} from "../schemas/permiso.schema";

import { useCreate, useUpdate } from "../hooks/usePermiso";

import type { Response, Request } from "../types/permiso.types";

interface PermisoFormDialogProps {
  open: boolean;
  editingPermission?: Response | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PermisoFormDialog({
  open,
  editingPermission,
  onClose,
  onSuccess,
}: PermisoFormDialogProps) {
  const createPermission = useCreate();
  const updatePermission = useUpdate();

  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = !!editingPermission;

  const { control, handleSubmit, reset, formState } = useForm<
    FormInput,
    unknown,
    FormValues
  >({
    resolver: zodResolver(schema),

    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const isSaving =
    formState.isSubmitting ||
    createPermission.isPending ||
    updatePermission.isPending;

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditing && editingPermission) {
      reset({
        nombre: editingPermission.nombre,
        descripcion: editingPermission.descripcion ?? "",
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
      });
    }
  }, [open, isEditing, editingPermission, reset]);

  const handleFormSubmit = async (values: FormValues) => {
    setSubmitError(null);

    const request: Request = {
      nombre: values.nombre,
      descripcion: values.descripcion || null,
    };

    try {
      if (isEditing && editingPermission) {
        await updatePermission.mutateAsync({
          id: editingPermission.id,
          request,
        });
      } else {
        await createPermission.mutateAsync(request);
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Failed to save permission:", error);

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
      <DialogTitle>
        {isEditing ? "Editar permiso" : "Nuevo permiso"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          {!isEditing && (
            <Alert severity="info">
              El permiso se creará con el estado predeterminado establecido por
              el sistema.
            </Alert>
          )}

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
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isSaving}>
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit(handleFormSubmit, (errors) => {
            console.error("PERMISSION FORM VALIDATION FAILED:", errors);
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
