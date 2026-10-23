import { Navigate, Outlet, useLocation } from "react-router-dom";

import { useNavigation } from "../../navigation/useNavigation";
import type { NavigationOption } from "../../navigation/navigation.types";
import {
  BASIC_CATALOG_PATH,
  getAvailableBasicCatalogs,
} from "../../catalog/basicCatalogs";

/** Routes that every authenticated user may reach even when they are not menu options. */
const ALWAYS_ALLOWED_ROUTES = [
  "/dashboard",
  "/profile",
  "/change-password",
  "/forbidden",
  "/unauthorized",
];

/** Detail routes whose access is granted by the listed menu option. */
const ROUTE_ALIASES: Record<string, string> = {
  "/sesion": "/sesiones",
};

function collectRoutes(options: NavigationOption[]): string[] {
  return options.flatMap((option) => [
    ...(option.rutaFrontend ? [option.rutaFrontend] : []),
    ...collectRoutes(option.children ?? []),
  ]);
}

function isWithin(pathname: string, route: string): boolean {
  return pathname === route || pathname.startsWith(`${route}/`);
}

export default function AuthorizedRoute() {
  const { navigation, loading } = useNavigation();
  const location = useLocation();

  if (loading) {
    return null;
  }

  const allowedRoutes = [
    ...ALWAYS_ALLOWED_ROUTES,
    ...navigation.flatMap((module) => collectRoutes(module.opciones ?? [])),
    ...(getAvailableBasicCatalogs(navigation).length > 0
      ? [BASIC_CATALOG_PATH]
      : []),
  ];

  const pathname = location.pathname;

  const aliasTarget = Object.entries(ROUTE_ALIASES).find(([alias]) =>
    isWithin(pathname, alias),
  )?.[1];

  const isAllowed = allowedRoutes.some(
    (route) =>
      isWithin(pathname, route) ||
      (aliasTarget !== undefined && route === aliasTarget),
  );

  if (!isAllowed) {
    return <Navigate to="/forbidden" replace />;
  }

  return <Outlet />;
}
