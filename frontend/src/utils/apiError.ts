import axios from "axios";  
import type {ApiErrorResponse, ValidationErrorResponse} from "../types/api.types";

export function getApiErrorMessage(error: unknown): string {

    if (!axios.isAxiosError(error)) {

        if (error instanceof Error && error.message) {
            return error.message;
        }

        return "An unexpected error occurred.";
    }


    if (!error.response) {
        return "Unable to connect to the server.";
    }


    const status = error.response.status;

    const data = error.response.data as
        | ApiErrorResponse
        | ValidationErrorResponse
        | string
        | undefined;

    if (
        status === 400 &&
        data &&
        typeof data === "object" &&
        !("message" in data) &&
        !("error" in data)
    ) {

        return Object.values(
            data as ValidationErrorResponse
        ).join(" ");
    }

    if (data && typeof data === "object") {

        const apiError = data as ApiErrorResponse;

        if (apiError.message) {
            return apiError.message;
        }

        if (apiError.error) {
            return apiError.error;
        }
    }

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    switch (status) {
        case 400:return "The request could not be processed.";
        case 401:return "Authentication is required.";
        case 403:return "Access denied.";
        case 404:return "The requested resource was not found.";
        case 409:return "The operation conflicts with existing data.";
        case 422:return "The submitted data is invalid.";
        case 500:return "An unexpected server error occurred.";
        default:return "An unexpected error occurred.";
    }
}