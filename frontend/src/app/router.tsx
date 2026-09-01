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
import PermissionListPage from "../catalog/pages/Permiso/PermisoListPage";
import PermissionCreatePage from "../catalog/pages/Permiso/PermisoCreatePage";
import PermissionEditPage from "../catalog/pages/Permiso/PermisoEditPage";
import ModuloListPage from "../administration/pages/ModuloListPage";
import OpcionListPage from "../administration/pages/OpcionListPage";
import RolListPage from "../administration/pages/RolListPage";
import UsuarioListPage from "../administration/pages/UsuarioListPage";
import CategoriaDiagnosticaCreatePage from "../catalog/pages/CategoriaDiagnostica/CategoriaDiagnosticaCreatePage";
import CategoriaDiagnosticaEditPage from "../catalog/pages/CategoriaDiagnostica/CategoriaDiagnosticaEditPage";
import CategoriaDiagnosticaListPage from "../catalog/pages/CategoriaDiagnostica/CategoriaDiagnosticaListPage";
import CondicionMedicaListPage from "../catalog/pages/CondicionMedica/CondicionMedicaListPage";
import CondicionMedicaCreatePage from "../catalog/pages/CondicionMedica/CondicionMedicaCreatePage";
import CondicionMedicaEditPage from "../catalog/pages/CondicionMedica/CondicionMedicaEditPage";
import EstadoCivilListPage from "../catalog/pages/EstadoCivil/EstadoCivilListPage";
import EstadoCivilCreatePage from "../catalog/pages/EstadoCivil/EstadoCivilCreatePage";
import EstadoCivilEditPage from "../catalog/pages/EstadoCivil/EstadoCivilEditPage";
import NivelConsistenciaListPage from "../catalog/pages/NivelConsistencia/NivelConsistenciaListPage";
import NivelConsistenciaCreatePage from "../catalog/pages/NivelConsistencia/NivelConsistenciaCreatePage";
import NivelConsistenciaEditPage from "../catalog/pages/NivelConsistencia/NivelConsistenciaEditPage";
import NivelEscolaridadCreatePage from "../catalog/pages/NivelEscolaridad/NivelEscolaridadCreatePage";
import NivelEscolaridadListPage from "../catalog/pages/NivelEscolaridad/NivelEscolaridadListPage";
import NivelEscolaridadEditPage from "../catalog/pages/NivelEscolaridad/NivelEscolaridadEditPage";
import NivelRiesgoListPage from "../catalog/pages/NivelRiesgo/NivelRiesgoListPage";
import NivelRiesgoCreatePage from "../catalog/pages/NivelRiesgo/NivelRiesgoCreatePage";
import NivelRiesgoEditPage from "../catalog/pages/NivelRiesgo/NivelRiesgoEditPage";
import NivelSeveridadAlergiaListPage from "../catalog/pages/NivelSeveridadAlergia/NivelSeveridadAlergiaListPage";
import NivelSeveridadAlergiaCreatePage from "../catalog/pages/NivelSeveridadAlergia/NivelSeveridadAlergiaCreatePage";
import NivelSeveridadAlergiaEditPage from "../catalog/pages/NivelSeveridadAlergia/NivelSeveridadAlergiaEditPage";
import TipoIntervencionListPage from "../catalog/pages/TipoIntervencion/TipoIntervencionListPage";
import TipoIntervencionoCreatePage from "../catalog/pages/TipoIntervencion/TipoIntervencionCreatePage";
import TipoIntervencionEditPage from "../catalog/pages/TipoIntervencion/TipoIntervencionEditPage";
import TipoPruebaListPage from "../catalog/pages/TipoPrueba/TipoPruebaListPage";
import TipoPruebaCreatePage from "../catalog/pages/TipoPrueba/TipoPruebaCreatePage";
import TipoPruebaEditPage from "../catalog/pages/TipoPrueba/TipoPruebaEditPage";
import TipoRiesgoListPage from "../catalog/pages/TipoRiesgo/TipoRiesgoListPage";
import TipoRiesgoCreatePage from "../catalog/pages/TipoRiesgo/TipoRiesgoCreatePage";
import TipoRiesgoEditPage from "../catalog/pages/TipoRiesgo/TipoRiesgoEditPage";
import TipoSesionListPage from "../catalog/pages/TipoSesion/TipoSesionListPage";
import TipoSesionCreatePage from "../catalog/pages/TipoSesion/TipoSesionCreatePage";
import TipoSesionEditPage from "../catalog/pages/TipoSesion/TipoSesionEditPage";
import TipoSustanciaAlergenaListPage from "../catalog/pages/TipoSustanciaAlergena/TipoSustanciaAlergenaListPage";
import TipoSustanciaAlergenaCreatePage from "../catalog/pages/TipoSustanciaAlergena/TipoSustanciaAlergenaCreatePage";
import TipoSustanciaAlergenaEditPage from "../catalog/pages/TipoSustanciaAlergena/TipoSustanciaAlergenaEditPage";
import CategoriaCriterioClinicoListPage from "../catalog/pages/CategoríaCriterioClinico/CategoriaCriterioClinicoListPage";
import CategoriaCriterioClinicoCreatePage from "../catalog/pages/CategoríaCriterioClinico/CategoriaCriterioClinicoCreatePage";
import CategoriaCriterioClinicoEditPage from "../catalog/pages/CategoríaCriterioClinico/CategoriaCriterioClinicoEditPage";
import AppointmentCreatePage from "../appointments/pages/AppointmentCreatePage";
import AppointmentEditPage from "../appointments/pages/AppointmentEditPage";
import AgendaPage from "../appointments/pages/AgendaPage";
import AppointmentDetailsPage from "../appointments/pages/AppointmentDetailsPage";
import ClinicalSessionPage from "../sessions/pages/ClinicalSessionPage";
import PatientsPage from "../patients/pages/PatientsPage";
import SessionsPage from "../sessions/pages/SessionsPage";

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
                path: "/administration/permissions/new",
                element: <PermissionCreatePage />,
              },
              {
                path: "/administration/permissions/:id/edit",
                element: <PermissionEditPage />,
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
                path: "/administration/categoria-diagnostica",
                element: <CategoriaDiagnosticaListPage />,
              },
              {
                path: "/administration/categoria-diagnostica/new",
                element: <CategoriaDiagnosticaCreatePage />,
              },
              {
                path: "/administration/categoria-diagnostica/:id/edit",
                element: <CategoriaDiagnosticaEditPage />,
              },
              {
                path: "/administration/condicion-medica",
                element: <CondicionMedicaListPage />,
              },
              {
                path: "/administration/condicion-medica/new",
                element: <CondicionMedicaCreatePage />,
              },
              {
                path: "/administration/condicion-medica/:id/edit",
                element: <CondicionMedicaEditPage />,
              },
              {
                path: "/administration/estado-civil",
                element: <EstadoCivilListPage />,
              },
              {
                path: "/administration/estado-civil/new",
                element: <EstadoCivilCreatePage />,
              },
              {
                path: "/administration/estado-civil/:id/edit",
                element: <EstadoCivilEditPage />,
              },
              {
                path: "/administration/nivel-consistencia",
                element: <NivelConsistenciaListPage />,
              },
              {
                path: "/administration/nivel-consistencia/new",
                element: <NivelConsistenciaCreatePage />,
              },
              {
                path: "/administration/nivel-consistencia/:id/edit",
                element: <NivelConsistenciaEditPage />,
              },
              {
                path: "/administration/nivel-escolaridad",
                element: <NivelEscolaridadListPage />,
              },
              {
                path: "/administration/nivel-escolaridad/new",
                element: <NivelEscolaridadCreatePage />,
              },
              {
                path: "/administration/nivel-escolaridad/:id/edit",
                element: <NivelEscolaridadEditPage />,
              },
              {
                path: "/administration/nivel-riesgo",
                element: <NivelRiesgoListPage />,
              },
              {
                path: "/administration/nivel-riesgo/new",
                element: <NivelRiesgoCreatePage />,
              },
              {
                path: "/administration/nivel-riesgo/:id/edit",
                element: <NivelRiesgoEditPage />,
              },
              {
                path: "/administration/nivel-severidad-alergia",
                element: <NivelSeveridadAlergiaListPage />,
              },
              {
                path: "/administration/nivel-severidad-alergia/new",
                element: <NivelSeveridadAlergiaCreatePage />,
              },
              {
                path: "/administration/nivel-severidad-alergia/:id/edit",
                element: <NivelSeveridadAlergiaEditPage />,
              },
              {
                path: "/administration/tipo-intervencion",
                element: <TipoIntervencionListPage />,
              },
              {
                path: "/administration/tipo-intervencion/new",
                element: <TipoIntervencionoCreatePage />,
              },
              {
                path: "/administration/tipo-intervencion/:id/edit",
                element: <TipoIntervencionEditPage />,
              },
              {
                path: "/administration/tipo-prueba",
                element: <TipoPruebaListPage />,
              },
              {
                path: "/administration/tipo-prueba/new",
                element: <TipoPruebaCreatePage />,
              },
              {
                path: "/administration/tipo-prueba/:id/edit",
                element: <TipoPruebaEditPage />,
              },
              {
                path: "/administration/tipo-riesgo",
                element: <TipoRiesgoListPage />,
              },
              {
                path: "/administration/tipo-riesgo/new",
                element: <TipoRiesgoCreatePage />,
              },
              {
                path: "/administration/tipo-riesgo/:id/edit",
                element: <TipoRiesgoEditPage />,
              },
              {
                path: "/administration/tipo-sesion",
                element: <TipoSesionListPage />,
              },
              {
                path: "/administration/tipo-sesion/new",
                element: <TipoSesionCreatePage />,
              },
              {
                path: "/administration/tipo-sesion/:id/edit",
                element: <TipoSesionEditPage />,
              },
              {
                path: "/administration/tipo-sustancia-alergena",
                element: <TipoSustanciaAlergenaListPage />,
              },
              {
                path: "/administration/tipo-sustancia-alergena/new",
                element: <TipoSustanciaAlergenaCreatePage />,
              },
              {
                path: "/administration/tipo-sustancia-alergena/:id/edit",
                element: <TipoSustanciaAlergenaEditPage />,
              },
              {
                path: "/administration/categoria-criterio-clinico",
                element: <CategoriaCriterioClinicoListPage />,
              },
              {
                path: "/administration/categoria-criterio-clinico/new",
                element: <CategoriaCriterioClinicoCreatePage />,
              },
              {
                path: "/administration/categoria-criterio-clinico/:id/edit",
                element: <CategoriaCriterioClinicoEditPage />,
              },
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
