import { useQuery } from "@tanstack/react-query";

import { getAll, getById } from "../api/estadoApi";

export const estadoKeys = {
    all: ["estados"] as const,

    detail: (id: number) =>
        ["estados", id] as const
};

export function useGetAllEstados() {
    return useQuery({
        queryKey: estadoKeys.all,
        queryFn: getAll,
        staleTime: 5 * 60 * 1000
    });
}

export function useEstado(id: number) {
    return useQuery({
        queryKey: estadoKeys.detail(id),
        queryFn: () => getById(id),
        enabled: id > 0
    });
}