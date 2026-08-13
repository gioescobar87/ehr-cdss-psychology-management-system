import axios from "axios";

export function getApiErrorMessage(
    error: unknown,
    fallback: string
): string {

    if (
        axios.isAxiosError(error)
    ) {

        const status =
            error.response?.status;

        const data =
            error.response?.data;

        if (
            status === 409
        ) {
            return (
                "No se puede programar la cita porque existe un conflicto de horario."
            );
        }

        if (
            status === 400
        ) {
            return (
                "Los datos de la cita no son válidos."
            );
        }

        if (
            status === 404
        ) {
            return (
                "No se encontró la cita o uno de los recursos asociados."
            );
        }

        if (
            typeof data?.message ===
            "string"
        ) {
            return data.message;
        }
    }

    return fallback;
}