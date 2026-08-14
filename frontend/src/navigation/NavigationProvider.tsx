import type { ReactNode } from "react";

import { useQuery } from "@tanstack/react-query";

import { NavigationContext } from "./NavigationContext";

import { getNavigation } from "./navigationApi";

interface Props {
  children: ReactNode;
}

export default function NavigationProvider({ children }: Props) {
  const {
    data = [],

    isLoading,

    refetch,
  } = useQuery({
    queryKey: ["navigation"],

    queryFn: getNavigation,

    staleTime: Infinity,

    gcTime: Infinity,

    refetchOnWindowFocus: false,

    retry: false,
  });

  return (
    <NavigationContext.Provider
      value={{
        navigation: data,

        loading: isLoading,

        reload: () => {
          void refetch();
        },
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}
