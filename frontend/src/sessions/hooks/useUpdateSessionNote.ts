import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSessionNote } from "../api/sessionContextApi";
import type { SessionNoteRequest } from "../types/sessionContext.types";

export function useUpdateSessionNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: number;
      request: SessionNoteRequest;
    }) => updateSessionNote(id, request),
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ["session-notes", note.sesionId],
      });
    },
  });
}
