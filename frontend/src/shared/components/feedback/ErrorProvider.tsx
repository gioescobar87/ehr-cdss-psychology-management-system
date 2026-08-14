import { useCallback, type ReactNode } from "react";
import { ErrorContext } from "./ErrorContext";
import { getApiErrorMessage } from "../../utils/apiError";
import { useNotification } from "../../hooks/useNotification";

interface Props {
  children: ReactNode;
}

export default function ErrorProvider({ children }: Props) {
  const { showError } = useNotification();
  const handleError = useCallback(
    (error: unknown) => {
      const message = getApiErrorMessage(error);

      console.error("Application error:", error);
      showError(message);
    },
    [showError],
  );

  return (
    <ErrorContext.Provider value={{ handleError }}>
      {children}
    </ErrorContext.Provider>
  );
}
