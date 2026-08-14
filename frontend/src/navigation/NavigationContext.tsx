import { createContext } from "react";
import type { NavigationModule } from "./navigation.types";

export interface NavigationContextType {
  navigation: NavigationModule[];

  loading: boolean;

  reload: () => void;
}

export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined);
