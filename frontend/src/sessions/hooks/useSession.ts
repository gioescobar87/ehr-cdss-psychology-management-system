import { useQuery } from "@tanstack/react-query";
import { getSessionById } from "../api/sessionApi";

export function useSession(id: number | undefined) {
  return useQuery({
    queryKey: ["session", id],
    queryFn: () => getSessionById(id!),
    enabled: id !== undefined,
  });
}
