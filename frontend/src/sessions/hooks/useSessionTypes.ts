import { useQuery } from "@tanstack/react-query";

import { getSessionTypes } from "../api/sessionTypeApi";

export function useSessionTypes(enabled = true) {
  return useQuery({
    queryKey: ["session-types"],
    queryFn: getSessionTypes,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
