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
  Tab,
  Tabs,
} from "@mui/material";

import FormTextField from "../../shared/components/forms/FormTextField";
import RolPermisosPanel from "./RolPermisosPanel";
import RolOpcionesPanel from "./RolOpcionesPanel";

import { schema, type FormValues } from "../schemas/rol.schema";
import { useCreate, useUpdate } from "../hooks/useRol";
import { useGetAllEstados } from "../../catalog/hooks/useEstados";

import type { Response, Request } from "../types/rol.types";

interface RolFormDialogProps {
  open: boolean;
  editingRol?: Response | null;
  onClose: () => void;
  onSuccess: () => void;
}

function isActive(estado: string): boolean {
  return estado.trim().toUpperCase() === "ACTIVO";
}

export default function RolFormDialog({
  open,
  editingRol,
  onClose,
  onSuccess,
}: RolFormDialogProps) {
  const createRol = useCreate();
  const updateRol = useUpdate();

  const { data: states = [] } = useGetAllEstados();

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [tab, setTab] = useState(0);

  const isEditing = !!editingRol;

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: "",
      descripcion: "",
    },
  });

  const isSaving =
    formState.isSubmitting || createRol.isPending || updateRol.isPending;

  const activeState = states.find((state) => isActive(state.nombre));

  /*
   * Synchronize the form fields with the role being edited.
   *
   * Tab state is intentionally not modified here. React discourages
   * synchronous state updates inside effects.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditing && editingRol) {
      reset({
        nombre: editingRol.nombre,
        descripcion: editingRol.descripcion ?? "",
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
      });
    }
  }, [open, isEditing, editingRol, reset]);

  const handleFormSubmit = async (values: FormValues) => {
    setSubmitError(null);

    const request: Request = {
      nombre: values.nombre,
      descripcion: values.descripcion || null,
    };

    try {
      if (isEditing && editingRol) {
        await updateRol.mutateAsync({
          id: editingRol.id,
          request,
        });
      } else {
        await createRol.mutateAsync(request);
      }

      /*
       * Reset the dialog's UI state before closing it.
       * This happens as part of the user-triggered submit flow,
       * not synchronously inside an effect.
       */
      setTab(0);
      onClose();
      onSuccess();
    } catch (error) {
      console.error("Failed to save role:", error);

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
    setTab(0);
    onClose();
  };

  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            height: {
              xs: "auto",
              md: 680,
            },
            maxHeight: "calc(100vh - 48px)",
          },
        },
      }}
    >
      <DialogTitle>{isEditing ? "Editar rol" : "Nuevo rol"}</DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 3,
        }}
      >
        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Datos generales" />

          <Tab label="Permisos" disabled={!isEditing} />

          <Tab label="Opciones" disabled={!isEditing || !activeState} />
        </Tabs>
      </Box>

      <DialogContent
        sx={{
          overflow: "auto",
        }}
      >
        <Stack spacing={3} sx={{ pt: 2 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          {!isEditing && (
            <Alert severity="info">El rol se creará con estado activo.</Alert>
          )}

          {tab === 0 && (
            <Stack spacing={3}>
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
            </Stack>
          )}

          {tab === 1 && isEditing && editingRol && (
            <RolPermisosPanel rolId={editingRol.id} />
          )}

          {tab === 2 && isEditing && editingRol && activeState && (
            <RolOpcionesPanel
              rolId={editingRol.id}
              activeEstadoId={activeState.id}
            />
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleClose} disabled={isSaving}>
          Cerrar
        </Button>

        {tab === 0 && (
          <Button
            onClick={handleSubmit(handleFormSubmit, (errors) => {
              console.error("ROLE FORM VALIDATION FAILED:", errors);
            })}
            variant="contained"
            disabled={isSaving || hasErrors}
          >
            {isSaving ? "Procesando..." : isEditing ? "Actualizar" : "Crear"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
