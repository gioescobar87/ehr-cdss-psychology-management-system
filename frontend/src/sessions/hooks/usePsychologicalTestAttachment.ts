import { useQuery } from "@tanstack/react-query";

import { getPsychologicalTestApplicationAttachment } from "../api/sessionPsychologicalTestApi";

interface UsePsychologicalTestAttachmentOptions {
  enabled?: boolean;
}

export function usePsychologicalTestAttachment(
  applicationId: number | null,
  options: UsePsychologicalTestAttachmentOptions = {},
) {
  return useQuery({
    queryKey: ["psychological-test-attachment", applicationId],
    queryFn: async () => {
      if (applicationId === null) {
        throw new Error("Psychological test application ID is required.");
      }

      return getPsychologicalTestApplicationAttachment(applicationId);
    },
    enabled: applicationId !== null && options.enabled !== false,
    staleTime: Infinity,
    gcTime: 5 * 60 * 1000,
  });
}