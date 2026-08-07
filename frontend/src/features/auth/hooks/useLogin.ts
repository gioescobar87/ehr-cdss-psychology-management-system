import { useMutation } from "@tanstack/react-query";

import { login } from "../../../api/authApi";
import { saveTokens } from "../../../auth/jwt";
import { useAuth } from "../../../auth/useAuth";

export function useLogin() {
    const {refreshSession} = useAuth();

    return useMutation({
        mutationFn: login,
        onSuccess: async (data) => {
            saveTokens(data.accessToken, data.refreshToken);
            await refreshSession();
        }
    });
}