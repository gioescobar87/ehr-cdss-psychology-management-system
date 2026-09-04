import apiClient from "../../shared/api/apiClient";

import type {
  LoginRequest,
  LoginResponse,
  UserProfile,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "../types/auth.types";

export async function login(request: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>("/auth/login", request);

  return response.data;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const response = await apiClient.get<UserProfile>("/auth/me");

  return response.data;
}

export async function logout(refreshToken: string): Promise<void> {
  await apiClient.post("/auth/logout", {
    refreshToken,
  });
}

export async function changePassword(
  request: ChangePasswordRequest,
): Promise<void> {
  await apiClient.post("/auth/change-password", request);
}

export async function forgotPassword(
  request: ForgotPasswordRequest,
): Promise<void> {
  await apiClient.post("/auth/forgot-password", request);
}

export async function resetPassword(
  request: ResetPasswordRequest,
): Promise<void> {
  await apiClient.post("/auth/reset-password", request);
}
