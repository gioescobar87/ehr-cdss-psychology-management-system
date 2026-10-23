import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import AuthLayout from "../layout/AuthLayout";
import EmptyLayout from "../layout/EmptyLayout";

import ProtectedRoute from "../auth/routes/ProtectedRoute";
import AuthorizedRoute from "../auth/routes/AuthorizedRoute";
import LoginPage from "../auth/pages/LoginPage";
import DashboardPage from "../dashboard/DashboardPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import NotFoundPage from "./pages/NotFoundPage";
import PublicOnlyRoute from "../auth/routes/PublicOnlyRoute";
import ProfilePage from "../auth/pages/ProfilePage";
import ChangePasswordPage from "../auth/pages/ChangePasswordPage";
import ForgotPasswordPage from "../auth/pages/ForgotPasswordPage";
import ResetPasswordPage from "../auth/pages/ResetPasswordPage";
import ForbiddenPage from "./pages/ForbiddenPage";
import PermissionListPage from "../administration/pages/PermisoListPage";
import ModuloListPage from "../administration/pages/ModuloListPage";
import OpcionListPage from "../administration/pages/OpcionListPage";
import RolListPage from "../administration/pages/RolListPage";
import UsuarioListPage from "../administration/pages/UsuarioListPage";
import BasicCatalogPage, {
  LegacyCatalogRedirect,
} from "../catalog/pages/BasicCatalogPage";
import { BASIC_CATALOG_PATH, basicCatalogs } from "../catalog/basicCatalogs";
import AppointmentCreatePage from "../appointments/pages/AppointmentCreatePage";
import AppointmentEditPage from "../appointments/pages/AppointmentEditPage";
import AgendaPage from "../appointments/pages/AgendaPage";
import AppointmentDetailsPage from "../appointments/pages/AppointmentDetailsPage";
import ClinicalSessionPage from "../sessions/pages/ClinicalSessionPage";
import PatientsPage from "../patients/pages/PatientsPage";
import SessionsPage from "../sessions/pages/SessionsPage";
import CoordinatorReportPage from "../reporting/pages/CoordinatorReportPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  {
    element: <PublicOnlyRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <LoginPage />,
          },
          {
            path: "/forgot-password",
            element: <ForgotPasswordPage />,
          },
          {
            path: "/reset-password",
            element: <ResetPasswordPage />,
          },
        ],
      },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AuthenticatedLayout />,
        children: [
          {
            element: <AuthorizedRoute />,
            children: [
              {
                path: "/dashboard",
                element: <DashboardPage />,
              },
              {
                path: "/pacientes",
                element: <PatientsPage />,
              },
              {
                path: "/sesiones",
                element: <SessionsPage />,
              },
              {
                path: "/reportes/coordinacion",
                element: <CoordinatorReportPage />,
              },
              {
                path: "/profile",
                element: <ProfilePage />,
              },
              {
                path: "/change-password",
                element: <ChangePasswordPage />,
              },
              {
                path: "/administration/permissions",
                element: <PermissionListPage />,
              },
              {
                path: "/administration/usuarios",
                element: <UsuarioListPage />,
              },
              {
                path: "/administration/roles",
                element: <RolListPage />,
              },
              {
                path: "/administration/modulos",
                element: <ModuloListPage />,
              },
              {
                path: "/administration/opciones",
                element: <OpcionListPage />,
              },
              {
                path: BASIC_CATALOG_PATH,
                element: <BasicCatalogPage />,
              },
              {
                path: `${BASIC_CATALOG_PATH}/new`,
                element: <BasicCatalogPage creating />,
              },
              {
                path: `${BASIC_CATALOG_PATH}/:id/edit`,
                element: <BasicCatalogPage />,
              },
              ...basicCatalogs.flatMap((catalog) => [
                {
                  path: `/administration/${catalog.id}`,
                  element: <LegacyCatalogRedirect catalogId={catalog.id} />,
                },
                {
                  path: `/administration/${catalog.id}/new`,
                  element: (
                    <LegacyCatalogRedirect catalogId={catalog.id} creating />
                  ),
                },
                {
                  path: `/administration/${catalog.id}/:id/edit`,
                  element: <LegacyCatalogRedirect catalogId={catalog.id} />,
                },
              ]),
              {
                path: "/citas/new",
                element: <AppointmentCreatePage />,
              },
              {
                path: "/citas/:id/edit",
                element: <AppointmentEditPage />,
              },
              {
                path: "/citas",
                element: <AgendaPage />,
              },
              {
                path: "/citas/:id",
                element: <AppointmentDetailsPage />,
              },
              {
                path: "/sesion/:id",
                element: <ClinicalSessionPage />,
              },
            ],
          },
        ],
      },
    ],
  },

  {
    element: <EmptyLayout />,
    children: [
      {
        path: "/unauthorized",
        element: <UnauthorizedPage />,
      },
      {
        path: "/forbidden",
        element: <ForbiddenPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);
