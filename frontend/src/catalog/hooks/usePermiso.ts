import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { create, getAll, getById, update, remove } from "../api/permisoApi";

import type { Request } from "../types/permiso.types";

export const keys = {
  all: ["permiso"] as const,

  detail: (id: number) => ["permiso", id] as const,
};

export function useGetAllPermisos() {
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
      void queryClient.invalidateQueries({
        queryKey: keys.all,
      });
    },
  });
}

export function useUpdate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, request }: { id: number; request: Request }) =>
      update(id, request),

    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({
        queryKey: keys.all,
      });

      void queryClient.invalidateQueries({
        queryKey: keys.detail(variables.id),
      });
    },
  });
}

export function useRemove() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: remove,

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: keys.all,
      });
    },
  });
}
