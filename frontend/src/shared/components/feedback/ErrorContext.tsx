import { createContext } from "react";

export interface ErrorContextType {
  handleError: (error: unknown) => void;
}

export const ErrorContext = createContext<ErrorContextType | undefined>(
  undefined,
);
