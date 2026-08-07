import { useCallback, useEffect, useState, type ReactNode } from "react";
import { clearTokens, getAccessToken } from "./jwt";
import { getCurrentUser } from "../api/authApi";
import { AuthContext } from "./AuthContext";
import type { UserProfile } from "../features/auth/types/auth.types";

interface Props {children: ReactNode};

export default function AuthProvider({children}: Props) {
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

    const logout = useCallback(() => {
        clearTokens();
        setUser(null);
        window.location.href = "/login";
    }, []);

    const value = {
        user,
        isAuthenticated: user !== null,
        isLoading,
        logout,
        refreshSession
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}