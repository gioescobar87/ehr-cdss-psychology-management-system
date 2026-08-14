import {
  useCallback,
  useState,
  type ReactNode,
  type SyntheticEvent,
} from "react";
import { Alert, Snackbar } from "@mui/material";
import {
  NotificationContext,
  type NotificationOptions,
} from "./NotificationContext";

interface Props {
  children: ReactNode;
}

export default function NotificationProvider({ children }: Props) {
  const [notification, setNotification] = useState<NotificationOptions | null>(
    null,
  );

  const showNotification = useCallback((options: NotificationOptions) => {
    setNotification({
      duration: 5000,
      ...options,
    });
  }, []);

  const showSuccess = useCallback(
    (message: string) => {
      showNotification({
        message,
        severity: "success",
      });
    },
    [showNotification],
  );

  const showError = useCallback(
    (message: string) => {
      showNotification({
        message,
        severity: "error",
      });
    },
    [showNotification],
  );

  const showWarning = useCallback(
    (message: string) => {
      showNotification({
        message,
        severity: "warning",
      });
    },
    [showNotification],
  );

  const showInfo = useCallback(
    (message: string) => {
      showNotification({
        message,
        severity: "info",
      });
    },
    [showNotification],
  );

  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setNotification(null);
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        showSuccess,
        showError,
        showWarning,
        showInfo,
      }}
    >
      {children}
      {notification && (
        <Snackbar
          open
          autoHideDuration={notification.duration ?? 5000}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <Alert
            onClose={handleClose}
            severity={notification.severity}
            variant="filled"
            elevation={6}
            sx={{
              width: "100%",
            }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      )}
    </NotificationContext.Provider>
  );
}
