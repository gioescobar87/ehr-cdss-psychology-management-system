import { useCallback, useEffect, useState, type ReactNode } from "react";

import { useQueryClient } from "@tanstack/react-query";

import { clearTokens, getAccessToken, getRefreshToken } from "../jwt";

import { getCurrentUser, logout as logoutAPI } from "../api/authApi";

import { AuthContext } from "../AuthContext";

import type { UserProfile } from "../types/auth.types";

import { useNotification } from "../../shared/hooks/useNotification";

import { SESSION_EXPIRED_EVENT } from "../sessionEvents";

import { useIdleTimeout } from "../hooks/useIdleTimeout";

import SessionTimeoutDialog from "../../shared/components/dialogs/SessionTimeoutDialog";

interface Props {
  children: ReactNode;
}

export default function AuthProvider({ children }: Props) {
  const { showError } = useNotification();

  const queryClient = useQueryClient();

  const [user, setUser] = useState<UserProfile | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  /*
   * Restore the current authenticated user.
   */
  const refreshSession = useCallback(async () => {
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
  }, []);

  /*
   * Handle an expired session caused by
   * an invalid/expired refresh token.
   */
  useEffect(() => {
    const handleSessionExpired = () => {
      clearTokens();

      setUser(null);

      queryClient.clear();

      showError("Your session has expired. Please sign in again.");

      window.location.href = "/login";
    };

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, [showError, queryClient]);

  /*
   * Restore session when the application starts.
   */
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

  /*
   * Central logout function.
   *
   * Used by:
   * - User logout
   * - Idle timeout
   */
  const logout = useCallback(async () => {
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
  }, [queryClient]);

  /*
   * Idle timeout.
   *
   * Only enabled while the user is
   * authenticated and the initial session
   * restoration has completed.
   */
  const {
    showWarning: showSessionTimeout,
    remainingSeconds,
    resetTimers,
  } = useIdleTimeout({
    enabled: user !== null && !isLoading,

    onLogout: logout,
  });

  const value = {
    user,

    isAuthenticated: user !== null,

    isLoading,

    logout,

    refreshSession,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      <SessionTimeoutDialog
        open={showSessionTimeout}

        remainingSeconds={remainingSeconds}

        onContinue={() => {
          resetTimers();
        }}

        onLogout={() => {
          void logout();
        }}
      />
    </AuthContext.Provider>
  );
}
