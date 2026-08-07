import { useCallback, type ReactNode } from "react";
import { ErrorContext } from "./ErrorContext";
import { getApiErrorMessage } from "../../utils/apiError";

interface Props {children: ReactNode;}

export default function ErrorProvider({
    children
}: Props) {
    const handleError = useCallback(
        (error: unknown) => {
            const message = getApiErrorMessage(error);

            console.error("Application error:", error);
            console.error("User-facing message", message);
        },
        []
    );

    return (
        <ErrorContext.Provider
            value={{handleError}}
        >
            {children}
        </ErrorContext.Provider>
    );
}