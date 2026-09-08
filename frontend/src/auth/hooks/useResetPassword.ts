import { useMutation } from "@tanstack/react-query";

import { resetPassword } from "../api/authApi";
import type { ResetPasswordRequest } from "../types/auth.types";

export function useResetPassword() {
  return useMutation({
    mutationFn: (request: ResetPasswordRequest) => resetPassword(request),
  });
}
