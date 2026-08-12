import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout from "../layout/AuthenticatedLayout";
import AuthLayout from "../layout/AuthLayout";
import EmptyLayout from "../layout/EmptyLayout";

import ProtectedRoute from "../auth/routes/ProtectedRoute";
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

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },

    {
        element: <PublicOnlyRoute />,
        children: [
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: "/login",
                        element: <LoginPage />
                    },
                    {
                        path: "/forgot-password",
                        element: <ForgotPasswordPage />
                    },
                    {
                        path: "/reset-password",
                        element: <ResetPasswordPage />
                    }
                ]
            }
        ]
    },

    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AuthenticatedLayout />,
                children: [
                    {
                        path: "/dashboard",
                        element: <DashboardPage />
                    },
                    {
                        path: "/profile",
                        element: <ProfilePage />
                    },
                    {
                        path: "/change-password",
                        element: <ChangePasswordPage />
                    },
                    {
                        path: "/administration/permissions",
                        element: <PermissionListPage />
                    },
                    {
                        path: "/administration/permissions/new",
                        element: <PermissionCreatePage />
                    },
                    {
                        path: "/administration/permissions/:id/edit",
                        element: <PermissionEditPage />
                    },
                    {
                        path: "/administration/categoria-diagnostica",
                        element: <CategoriaDiagnosticaListPage />
                    },
                    {
                        path: "/administration/categoria-diagnostica/new",
                        element: <CategoriaDiagnosticaCreatePage />
                    },
                    {
                        path: "/administration/categoria-diagnostica/:id/edit",
                        element: <CategoriaDiagnosticaEditPage />
                    },
                    {
                        path: "/administration/condicion-medica",
                        element: <CondicionMedicaListPage />
                    },
                    {
                        path: "/administration/condicion-medica/new",
                        element: <CondicionMedicaCreatePage />
                    },
                    {
                        path: "/administration/condicion-medica/:id/edit",
                        element: <CondicionMedicaEditPage />
                    },
                    {
                        path: "/administration/estado-civil",
                        element: <EstadoCivilListPage />
                    },
                    {
                        path: "/administration/estado-civil/new",
                        element: <EstadoCivilCreatePage />
                    },
                    {
                        path: "/administration/estado-civil/:id/edit",
                        element: <EstadoCivilEditPage />
                    },
                    {
                        path: "/administration/nivel-consistencia",
                        element: <NivelConsistenciaListPage />
                    },
                    {
                        path: "/administration/nivel-consistencia/new",
                        element: <NivelConsistenciaCreatePage />
                    },
                    {
                        path: "/administration/nivel-consistencia/:id/edit",
                        element: <NivelConsistenciaEditPage />
                    }
                ]
            }
        ]
    },

    {
        element: <EmptyLayout />,
        children: [
            {
                path: "/unauthorized",
                element: <UnauthorizedPage />
            },
            {
                path: "/forbidden",
                element: <ForbiddenPage />
            },
            {
                path: "*",
                element: <NotFoundPage />
            }
        ]
    }
]);