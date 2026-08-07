import apiClient from "./apiClient";

import type { LoginRequest, LoginResponse, UserProfile } from "../features/auth/types/auth.types";

export async function login(request: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
        "/auth/login",
        request
    );

    return response.data;
}

export async function getCurrentUser(): Promise<UserProfile> {
    const response = await apiClient.get<UserProfile>(
        "/auth/me"
    );

    return response.data;
}