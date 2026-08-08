import { useCallback, useEffect, useState, type ReactNode } from "react";
import { clearTokens, getAccessToken, getRefreshToken } from "./jwt";
import { getCurrentUser, logout as logoutAPI } from "../api/authApi";
import { AuthContext } from "./AuthContext";
import type { UserProfile } from "../features/auth/types/auth.types";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "../hooks/useNotification";
import { SESSION_EXPIRED_EVENT } from "./sessionEvents";

interface Props {children: ReactNode};

export default function AuthProvider({children}: Props) {
    const { showError } = useNotification();
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

        const handleSessionExpired = () => {

            clearTokens();

            setUser(null);

            showError(
                "Your session has expired. Please sign in again."
            );

            window.location.href = "/login";

        };

        window.addEventListener(
            SESSION_EXPIRED_EVENT,
            handleSessionExpired
        );

        return () => {

            window.removeEventListener(
                SESSION_EXPIRED_EVENT,
                handleSessionExpired
            );

        };

    }, [showError]);

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