import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  create,
  getAll,
  getById,
  update,
  changeStatus,
} from "../api/moduloApi";

import type { Request } from "../types/modulo.types";

export const keys = {
  all: ["modulo"] as const,
  detail: (id: number) => ["modulo", id] as const,
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
