import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

import {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,
} from "../../auth/jwt";
import { notifySessionExpired } from "../../auth/sessionEvents";

const API_BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
});

const publicEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/forgot-password",
  "/auth/reset-password",
];

function isPublicEndpoint(url?: string) {
  if (!url) {
    return false;
  }

  return publicEndpoints.some((endpoint) => url.startsWith(endpoint));
}

/*
 * Prevent multiple simultaneous refresh requests.
 *
 * If several requests receive 401 at the same time,
 * they will share the same refresh operation.
 */
let refreshPromise: Promise<string> | null = null;

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

async function refreshAccessToken(): Promise<string> {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error("No refresh token available");
  }

  const response = await refreshClient.post("/auth/refresh-token", null, {
    params: {
      refreshToken,
    },
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data;

  saveTokens(accessToken, newRefreshToken);

  return accessToken;
}

function handleSessionExpiration() {
  clearTokens();
  notifySessionExpired();
}

apiClient.interceptors.request.use((config) => {
  /*
   * Public endpoints must never receive
   * an automatically attached access token.
   */
  if (isPublicEndpoint(config.url)) {
    return config;
  }

  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    /*
     * Nothing to retry if Axios doesn't have
     * an original request.
     */
    if (!originalRequest) {
      return Promise.reject(error);
    }

    /*
     * NEVER try to refresh after a failed login
     * or another public authentication endpoint.
     */
    if (isPublicEndpoint(originalRequest.url)) {
      return Promise.reject(error);
    }

    /*
     * Only handle 401 responses.
     */
    if (error.response?.status !== 401) {
      if (error.response?.status === 403) {
        window.location.href = "/forbidden";

        return Promise.reject(error);
      }

      return Promise.reject(error);
    }

    /*
     * Prevent infinite retry loops.
     */
    if (originalRequest._retry) {
      handleSessionExpiration();

      return Promise.reject(error);
    }

    originalRequest._retry = true;

    /*
     * If there is no refresh token, the session
     * cannot be recovered.
     */
    if (!getRefreshToken()) {
      handleSessionExpiration();

      return Promise.reject(error);
    }

    try {
      /*
       * If another request is already refreshing,
       * wait for that same refresh operation.
       */
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
      }

      const newAccessToken = await refreshPromise;

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return apiClient(originalRequest);
    } catch (refreshError) {
      handleSessionExpiration();

      return Promise.reject(refreshError);
    }
  },
);

export default apiClient;
