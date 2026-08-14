import { createContext } from "react";

export type NotificationSeverity = "success" | "error" | "warning" | "info";

export interface NotificationOptions {
  message: string;
  severity: NotificationSeverity;
  duration?: number;
}

export interface NotificationContextType {
  showNotification: (options: NotificationOptions) => void;

  showSuccess: (message: string) => void;

  showError: (message: string) => void;

  showWarning: (message: string) => void;

  showInfo: (message: string) => void;
}

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
