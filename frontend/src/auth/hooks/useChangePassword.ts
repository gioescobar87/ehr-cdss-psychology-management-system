import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/authApi";

export function useChangePassword() {
  return useMutation({
    mutationFn: changePassword,
  });
}
