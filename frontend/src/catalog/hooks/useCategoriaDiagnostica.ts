import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  create,
  getAll,
  getById,
  update,
  remove,
} from "../api/categoriaDiagnosticaApi";

import type { Request } from "../types/catalogDTOs.types";

export const keys = {
  all: ["categoria-diagnostica"] as const,

  detail: (id: number) => ["categoria-diagnostica", id] as const,
};

export function useGetAllCategorias() {
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
