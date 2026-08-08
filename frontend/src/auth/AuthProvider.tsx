import { useCallback, useEffect, useState, type ReactNode } from "react";
import { clearTokens, getAccessToken, getRefreshToken } from "./jwt";
import { getCurrentUser, logout as logoutAPI } from "../api/authApi";
import { AuthContext } from "./AuthContext";
import type { UserProfile } from "../features/auth/types/auth.types";
import { useQueryClient } from "@tanstack/react-query";

interface Props {children: ReactNode};

export default function AuthProvider({children}: Props) {
    const queryClient = useQueryClient();
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const refreshSession = useCallback(
        async () => {
            const accessToken = getAccessToken();

            if (!accessToken) {
                setUser(null);
                return;
            }
            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);
            } catch {
                clearTokens();
                setUser(null);
            }
        },
        []
    );

    useEffect(() => {
        const initialize = async () => {
            try {
                await refreshSession();
            } finally {
                setIsLoading(false);
            }
        };
        void initialize();
    }, [refreshSession]);

    const logout = useCallback(
        async () => {
            const refreshToken = getRefreshToken();
            try {
                if (refreshToken) {
                    await logoutAPI(refreshToken);
                }
            } finally {
                clearTokens();
                setUser(null);
                queryClient.clear();
                window.location.href = "/login";
            }
        },
        [queryClient]
    );

    const value = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        logout,
        refreshSession
    };

    return (
        <AuthContext.Provider
        value={value}
        >
            {children}
        </AuthContext.Provider>
    );
}