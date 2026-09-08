import { useEffect, useState } from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
} from "@mui/material";

import FormTextField from "../../shared/components/forms/FormTextField";
import RolesSelectionPanel from "./RolesSelectionPanel";

import { schema, type FormValues } from "../schemas/usuario.schema";
import { useGetAllEstados } from "../../catalog/hooks/useEstados";
import {
  useCreate,
  useUpdate,
  useAssignRol,
  useRemoveRol,
  useUsuarioRoles,
} from "../hooks/useUsuario";

import type { Response, Request } from "../types/usuario.types";

interface UsuarioFormDialogProps {
  open: boolean;
  editingUsuario?: Response | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function UsuarioFormDialog({
  open,
  editingUsuario,
  onClose,
  onSuccess,
}: UsuarioFormDialogProps) {
  const { data: states = [] } = useGetAllEstados();

  const createUsuario = useCreate();
  const updateUsuario = useUpdate();
  const assignRol = useAssignRol();
  const removeRol = useRemoveRol();

  const [selectedRoleIds, setSelectedRoleIds] = useState<number[]>([]);
  const [isSavingRoles, setIsSavingRoles] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditing = !!editingUsuario;

  const { data: existingRoles = [], isLoading: isLoadingRoles } =
    useUsuarioRoles(editingUsuario?.id ?? 0);

  const { control, handleSubmit, reset, formState } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: "",
      nombre: "",
      apellido: "",
      correo: "",
    },
  });

  const isSaving =
    formState.isSubmitting ||
    createUsuario.isPending ||
    updateUsuario.isPending ||
    isSavingRoles;

  /*
   * Reset the form whenever the dialog is opened for a different user.
   */
  useEffect(() => {
    setSubmitError(null);

    if (!open) {
      reset();
      setSelectedRoleIds([]);
      return;
    }

    if (isEditing && editingUsuario) {
      reset({
        username: editingUsuario.username,
        nombre: editingUsuario.nombre,
        apellido: editingUsuario.apellido,
        correo: editingUsuario.correo,
      });

      /*
       * Existing roles are loaded asynchronously by useUsuarioRoles.
       * They are populated by the effect below.
       */
      setSelectedRoleIds([]);
    } else {
      reset({
        username: "",
        nombre: "",
        apellido: "",
        correo: "",
      });

      setSelectedRoleIds([]);
    }
  }, [open, isEditing, editingUsuario, reset]);

  /*
   * Populate the role selector after the existing roles have been loaded.
   */
  useEffect(() => {
    if (!open || !isEditing || !editingUsuario || isLoadingRoles) {
      return;
    }

    setSelectedRoleIds(existingRoles.map((role) => role.id));
  }, [open, isEditing, editingUsuario, existingRoles, isLoadingRoles]);

  /*
   * Synchronize the selected roles with the roles currently assigned
   * to the user.
   */
  const synchronizeRoles = async (usuarioId: number, selectedIds: number[]) => {
    const existingIds = existingRoles.map((role) => role.id);

    const rolesToAdd = selectedIds.filter(
      (roleId) => !existingIds.includes(roleId),
    );

    const rolesToRemove = existingIds.filter(
      (roleId) => !selectedIds.includes(roleId),
    );

    await Promise.all([
      ...rolesToAdd.map((roleId) =>
        assignRol.mutateAsync({
          usuarioId,
          rolId: roleId,
        }),
      ),
      ...rolesToRemove.map((roleId) =>
        removeRol.mutateAsync({
          usuarioId,
          rolId: roleId,
        }),
      ),
    ]);
  };

  const handleFormSubmit = async (values: FormValues) => {
    setSubmitError(null);

    /*
     * New users must have at least one role.
     */
    if (!isEditing && selectedRoleIds.length === 0) {
      setSubmitError("Debe seleccionar al menos un rol.");
      return;
    }

    /*
     * When editing, do not allow submission until the current roles
     * have been loaded. Otherwise we could accidentally remove all
     * existing roles.
     */
    if (isEditing && isLoadingRoles) {
      setSubmitError("Los roles del usuario todavía se están cargando.");
      return;
    }

    const request: Request = {
      username: values.username,
      nombre: values.nombre,
      apellido: values.apellido,
      correo: values.correo,
    };

    try {
      if (isEditing && editingUsuario) {
        /*
         * 1. Update the user's basic information.
         */
        await updateUsuario.mutateAsync({
          id: editingUsuario.id,
          request,
        });

        /*
         * 2. Synchronize role assignments.
         */
        setIsSavingRoles(true);

        try {
          await synchronizeRoles(editingUsuario.id, selectedRoleIds);
        } finally {
          setIsSavingRoles(false);
        }
      } else {
        /*
         * 1. Create the user.
         */
        const createdUsuario = await createUsuario.mutateAsync(request);

        /*
         * 2. Assign the selected roles.
         */
        setIsSavingRoles(true);

        try {
          await Promise.all(
            selectedRoleIds.map((roleId) =>
              assignRol.mutateAsync({
                usuarioId: createdUsuario.id,
                rolId: roleId,
              }),
            ),
          );
        } finally {
          setIsSavingRoles(false);
        }
      }

      onClose();
      onSuccess();
    } catch (error) {
      console.error("Failed to save user:", error);

      setSubmitError(
        "No fue posible guardar los cambios. Verifique la información e inténtelo nuevamente.",
      );
    }
  };

  const activeState = states.find(
    (state) => state.nombre.trim().toUpperCase() === "ACTIVO",
  );

  const hasErrors = Object.keys(formState.errors).length > 0;

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {isEditing ? "Editar usuario" : "Nuevo usuario"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 2 }}>
          {submitError && <Alert severity="error">{submitError}</Alert>}

          {!isEditing && (
            <Alert severity="info">
              "El usuario recibirá contraseña inicial en el correo electrónico
              registrado. Por seguridad, deberá cambiar su contraseña después de
              iniciar sesión."
            </Alert>
          )}

          <FormTextField
            name="username"
            control={control}
            label="Usuario"
            required
            disabled={isEditing || isSaving}
            fullWidth
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
            name="apellido"
            control={control}
            label="Apellido"
            required
            disabled={isSaving}
            fullWidth
          />

          <FormTextField
            name="correo"
            control={control}
            label="Correo electrónico"
            type="email"
            required
            disabled={isSaving}
            fullWidth
          />

          {!isEditing && activeState && (
            <Alert severity="success">
              El usuario se creará con estado:{" "}
              <strong>{activeState.nombre}</strong>
            </Alert>
          )}

          {isEditing && isLoadingRoles && (
            <Alert severity="info">
              Cargando los roles actuales del usuario...
            </Alert>
          )}

          <RolesSelectionPanel
            selectedRoleIds={selectedRoleIds}
            onChange={setSelectedRoleIds}
            loading={isSaving || isLoadingRoles}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} disabled={isSaving}>
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit(handleFormSubmit, (errors) => {
            console.error("FORM VALIDATION FAILED:", errors);
          })}
          variant="contained"
          disabled={
            isSaving ||
            isLoadingRoles ||
            (!isEditing && selectedRoleIds.length === 0) ||
            hasErrors
          }
        >
          {isSaving ? "Procesando..." : isEditing ? "Actualizar" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
