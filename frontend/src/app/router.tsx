import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import AuthLayout from "../layouts/AuthLayout";
import EmptyLayout from "../layouts/EmptyLayout";

import ProtectedRoute from "../auth/ProtectedRoute";
import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";
import PublicOnlyRoute from "../auth/PublicOnlyRoute";
import ProfilePage from "../pages/ProfilePage";
import ChangePasswordPage from "../pages/ChangePasswordPage";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
import ResetPasswordPage from "../pages/ResetPasswordPage";
import ForbiddenPage from "../pages/ForbiddenPage";

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