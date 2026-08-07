import { useMutation } from "@tanstack/react-query";
import { login } from "../../../api/authApi";

import { saveTokens } from "../../../auth/jwt";

export function useLogin() {
    return useMutation({
        mutationFn: login,
        onSuccess(data) {
            saveTokens(data.accessToken, data.refreshToken);
        }
    });
}