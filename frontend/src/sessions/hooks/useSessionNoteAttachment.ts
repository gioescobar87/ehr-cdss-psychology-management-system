import { useQuery } from "@tanstack/react-query";

import { getSessionNoteAttachment } from "../api/sessionContextApi";

interface UseSessionNoteAttachmentOptions {
  enabled?: boolean;
}

export function useSessionNoteAttachment(
  noteId: number | null,
  options: UseSessionNoteAttachmentOptions = {},
) {
  return useQuery({
    queryKey: ["session-note-attachment", noteId],
    queryFn: async () => {
      if (noteId === null) {
        throw new Error("Session note ID is required.");
      }

      return getSessionNoteAttachment(noteId);
    },
    enabled: noteId !== null && options.enabled !== false,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
}
