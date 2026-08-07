import { createBrowserRouter, Navigate } from "react-router-dom";

import AuthenticatedLayout from "../layouts/AuthenticatedLayout";
import AuthLayout from "../layouts/AuthLayout";
import EmptyLayout from "../layouts/EmptyLayout";

import LoginPage from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import UnauthorizedPage from "../pages/UnauthorizedPage";
import NotFoundPage from "../pages/NotFoundPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/login" replace />
    },

    {
        element: <AuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />
            }
        ]
    },

    {
        element: <AuthenticatedLayout />,
        children: [
            {
                path: "/dashboard",
                element: <DashboardPage />
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
                path: "*",
                element: <NotFoundPage />
            }
        ]
    }
]);