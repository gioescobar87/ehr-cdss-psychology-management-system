import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSessionNote } from "../api/sessionContextApi";
import type { SessionNoteRequest } from "../types/sessionContext.types";

interface UpdateSessionNoteVariables {
  id: number;
  request: SessionNoteRequest;
  attachment?: File | null;
}

export function useUpdateSessionNote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
      attachment,
    }: UpdateSessionNoteVariables) =>
      updateSessionNote(id, request, attachment),
    onSuccess: (note) => {
      queryClient.invalidateQueries({
        queryKey: ["session-notes", note.sesionId],
      });
    },
  });
}
