import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  create,
  getAll,
  getById,
  update,
  changeStatus,
  remove,
  getPermisos,
  assignPermiso,
  removePermiso,
  getOpciones,
  assignOpcion,
  removeOpcion,
} from "../api/rolApi";

import type { Request, RolOpcionRequest } from "../types/rol.types";

export const keys = {
  all: ["rol"] as const,
  detail: (id: number) => ["rol", id] as const,
  permisos: (id: number) => ["rol", id, "permisos"] as const,
  opciones: (id: number) => ["rol", id, "opciones"] as const,
};

export function useGetAll() {
  return useQuery({
    queryKey: keys.all,
    queryFn: getAll,
  });
}

export function useGetById(id: number) {
  return useQuery({
    queryKey: keys.detail(id),
    queryFn: () => getById(id),
    enabled: id > 0,
  });
}

export function useCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: Request) => create(request),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: Request }) =>
      update(id, request),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: keys.all });
      void queryClient.invalidateQueries({
        queryKey: keys.detail(variables.id),
      });
    },
  });
}

export function useChangeStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, estadoId }: { id: number; estadoId: number }) =>
      changeStatus(id, estadoId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: keys.all });
      void queryClient.invalidateQueries({
        queryKey: keys.detail(variables.id),
      });
    },
  });
}

export function useRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => remove(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: keys.all });
    },
  });
}

export function useRolPermisos(rolId: number) {
  return useQuery({
    queryKey: keys.permisos(rolId),
    queryFn: () => getPermisos(rolId),
    enabled: rolId > 0,
  });
}

export function useAssignPermiso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rolId, permisoId }: { rolId: number; permisoId: number }) =>
      assignPermiso(rolId, permisoId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: keys.permisos(variables.rolId),
      });
    },
  });
}

export function useRemovePermiso() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rolId, permisoId }: { rolId: number; permisoId: number }) =>
      removePermiso(rolId, permisoId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: keys.permisos(variables.rolId),
      });
    },
  });
}

export function useRolOpciones(rolId: number) {
  return useQuery({
    queryKey: keys.opciones(rolId),
    queryFn: () => getOpciones(rolId),
    enabled: rolId > 0,
  });
}

export function useAssignOpcion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      rolId,
      request,
    }: {
      rolId: number;
      request: RolOpcionRequest;
    }) => assignOpcion(rolId, request),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: keys.opciones(variables.rolId),
      });
    },
  });
}

export function useRemoveOpcion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ rolId, opcionId }: { rolId: number; opcionId: number }) =>
      removeOpcion(rolId, opcionId),
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: keys.opciones(variables.rolId),
      });
    },
  });
}
