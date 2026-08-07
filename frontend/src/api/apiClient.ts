import axios from "axios";

import {
    getAccessToken,
    getRefreshToken,
    saveTokens,
    clearTokens
} from "../auth/jwt";


const apiClient = axios.create({

    baseURL: "http://localhost:8080/api"

});


const refreshClient = axios.create({

    baseURL: "http://localhost:8080/api"

});


const publicEndpoints = [

    "/auth/login",
    "/auth/register",
    "/auth/refresh-token",
    "/auth/forgot-password",
    "/auth/reset-password",
    "/auth/navigation"

];


apiClient.interceptors.request.use(

    config => {

        const isPublicEndpoint =
            publicEndpoints.some(endpoint =>
                config.url?.startsWith(endpoint)
            );

        if (isPublicEndpoint) {
            return config;
        }

        const token = getAccessToken();

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        return config;

    }

);


apiClient.interceptors.response.use(

    response => response,

    async error => {

        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        const refreshToken = getRefreshToken();

        if (!refreshToken) {

            clearTokens();

            window.location.href = "/login";

            return Promise.reject(error);

        }

        try {

            const response =
                await refreshClient.post(
                    "/auth/refresh-token",
                    null,
                    {
                        params: {
                            refreshToken
                        }
                    }
                );

            const {
                accessToken,
                refreshToken: newRefreshToken
            } = response.data;

            saveTokens(accessToken, newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            return apiClient(originalRequest);

        } catch (refreshError) {

            clearTokens();

            window.location.href = "/login";

            return Promise.reject(refreshError);

        }

    }

);


export default apiClient;