import { createContext } from "react";
import type { UserProfile } from "../features/auth/types/auth.types";

export interface AuthContextType {
    user: UserProfile | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);