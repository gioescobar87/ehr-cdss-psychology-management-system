import { useEffect, useState } from "react";

import {
  Controller,
  useForm,
  useWatch,
} from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import FormTextField from "../../shared/components/forms/FormTextField";
import FormSelect from "../../shared/components/forms/FormSelect";

import {
  schema,
  type FormInput,
  type FormValues,
} from "../schemas/opcion.schema";

import {
  useCreate,
  useUpdate,
} from "../hooks/useOpcion";

import { useGetAll as useGetAllModulos } from "../hooks/useModulo";

import type {
  Response,
  Request,
} from "../types/opcion.types";

interface OpcionFormDialogProps {
  open: boolean;
  editingOpcion?: Response | null;
  opciones: Response[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function OpcionFormDialog({
  open,
  editingOpcion,
  opciones,
  onClose,
  onSuccess,
}: OpcionFormDialogProps) {
  const createOpcion = useCreate();
  const updateOpcion = useUpdate();

  const {
    data: modulos = [],
  } = useGetAllModulos();

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const isEditing = !!editingOpcion;

  const {
    control,
    handleSubmit,
    reset,
    formState,
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      moduloId: 0,
      opcionPadreId: null,
      nombre: "",
      descripcion: "",
      rutaFrontend: "",
      componente: "",
      icono: "",
      orden: 1,
      visibleMenu: true,
      requiereAutenticacion: true,
      esMenuPrincipal: false,
    },
  });

  const isSaving =
    formState.isSubmitting ||
    createOpcion.isPending ||
    updateOpcion.isPending;

  /*
   * useWatch is used instead of watch() so the component
   * remains compatible with the React Compiler.
   */
  const selectedModuloId = useWatch({
    control,
    name: "moduloId",
  });

  const parentOptions = opciones.filter(
    (opcion) =>
      opcion.moduloId === selectedModuloId &&
      opcion.id !== editingOpcion?.id,
  );

  /*
   * Synchronize the form with the option being edited.
   *
   * No local React state is updated inside this effect.
   */
  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditing && editingOpcion) {
      reset({
        moduloId: editingOpcion.moduloId,
        opcionPadreId:
          editingOpcion.opcionPadreId ?? null,
        nombre: editingOpcion.nombre,
        descripcion:
          editingOpcion.descripcion ?? "",
        rutaFrontend:
          editingOpcion.rutaFrontend,
        componente:
          editingOpcion.componente ?? "",
        icono:
          editingOpcion.icono ?? "",
        orden: editingOpcion.orden,
        visibleMenu:
          editingOpcion.visibleMenu,
        requiereAutenticacion:
          editingOpcion.requiereAutenticacion,
        esMenuPrincipal:
          editingOpcion.esMenuPrincipal,
      });
    } else {
      reset({
        moduloId: 0,
        opcionPadreId: null,
        nombre: "",
        descripcion: "",
        rutaFrontend: "",
        componente: "",
        icono: "",
        orden: 1,
        visibleMenu: true,
        requiereAutenticacion: true,
        esMenuPrincipal: false,
      });
    }
  }, [
    open,
    isEditing,
    editingOpcion,
    reset,
  ]);

  const handleFormSubmit = async (
    values: FormValues,
  ) => {
    setSubmitError(null);

    const request: Request = {
      moduloId: values.moduloId,
      opcionPadreId: values.opcionPadreId,
      nombre: values.nombre,
      descripcion:
        values.descripcion || null,
      rutaFrontend: values.rutaFrontend,
      componente:
        values.componente || null,
      icono:
        values.icono || null,
      orden: values.orden,
      visibleMenu:
        values.visibleMenu,
      requiereAutenticacion:
        values.requiereAutenticacion,
      esMenuPrincipal:
        values.esMenuPrincipal,
    };

    try {
      if (isEditing && editingOpcion) {
        await updateOpcion.mutateAsync({
          id: editingOpcion.id,
          request,
        });
      } else {
        await createOpcion.mutateAsync(
          request,
        );
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error(
        "Failed to save option:",
        error,
      );

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

  const hasErrors =
    Object.keys(formState.errors).length > 0;

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
            maxHeight:
              "calc(100vh - 48px)",
          },
        },
      }}
    >
      <DialogTitle>
        {isEditing
          ? "Editar opción"
          : "Nueva opción"}
      </DialogTitle>

      <DialogContent
        sx={{ overflow: "auto" }}
      >
        <Stack
          spacing={3}
          sx={{ pt: 2 }}
        >
          {submitError && (
            <Alert severity="error">
              {submitError}
            </Alert>
          )}

          {!isEditing && (
            <Alert severity="info">
              La opción se creará con el estado
              predeterminado establecido por el
              sistema.
            </Alert>
          )}

          <Box
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            <FormSelect
              name="moduloId"
              control={control}
              label="Módulo"
              options={modulos.map(
                (modulo) => ({
                  value: modulo.id,
                  label: modulo.nombre,
                }),
              )}
              disabled={isSaving}
            />

            <Controller
              name="opcionPadreId"
              control={control}
              render={({ field }) => (
                <TextField
                  select
                  label="Opción padre"
                  value={
                    field.value ?? ""
                  }
                  onChange={(event) =>
                    field.onChange(
                      event.target.value ===
                        ""
                        ? null
                        : Number(
                            event.target.value,
                          ),
                    )
                  }
                  disabled={isSaving}
                  helperText="Opcional. Deje en blanco para una opción de primer nivel."
                  fullWidth
                >
                  <MenuItem value="">
                    <em>
                      Sin opción padre
                    </em>
                  </MenuItem>

                  {parentOptions.map(
                    (opcion) => (
                      <MenuItem
                        key={opcion.id}
                        value={opcion.id}
                      >
                        {opcion.nombre}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              )}
            />

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
              minRows={2}
              disabled={isSaving}
              fullWidth
            />

            <FormTextField
              name="rutaFrontend"
              control={control}
              label="Ruta del frontend"
              required
              helperText="Ruta de React Router, ej. '/administration/usuarios'."
              disabled={isSaving}
              fullWidth
            />

            <FormTextField
              name="componente"
              control={control}
              label="Componente"
              helperText="Referencia informativa del componente asociado."
              disabled={isSaving}
              fullWidth
            />

            <FormTextField
              name="icono"
              control={control}
              label="Icono"
              helperText="Nombre del icono de Material Icons."
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

            <Stack
              direction={{
                xs: "column",
                sm: "row",
              }}
              spacing={1}
            >
              <Controller
                name="visibleMenu"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          field.value
                        }
                        onChange={(
                          event,
                        ) =>
                          field.onChange(
                            event.target
                              .checked,
                          )
                        }
                        disabled={
                          isSaving
                        }
                      />
                    }
                    label="Visible en el menú"
                  />
                )}
              />

              <Controller
                name="requiereAutenticacion"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          field.value
                        }
                        onChange={(
                          event,
                        ) =>
                          field.onChange(
                            event.target
                              .checked,
                          )
                        }
                        disabled={
                          isSaving
                        }
                      />
                    }
                    label="Requiere autenticación"
                  />
                )}
              />

              <Controller
                name="esMenuPrincipal"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={
                          field.value
                        }
                        onChange={(
                          event,
                        ) =>
                          field.onChange(
                            event.target
                              .checked,
                          )
                        }
                        disabled={
                          isSaving
                        }
                      />
                    }
                    label="Menú principal"
                  />
                )}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleClose}
          disabled={isSaving}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit(
            handleFormSubmit,
            (errors) => {
              console.error(
                "OPTION FORM VALIDATION FAILED:",
                errors,
              );
            },
          )}
          variant="contained"
          disabled={
            isSaving || hasErrors
          }
        >
          {isSaving
            ? "Procesando..."
            : isEditing
              ? "Actualizar"
              : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}