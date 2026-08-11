import type { ReactNode } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import AuthProvider from "../auth/providers/AuthProvider";
import ErrorProvider from "../shared/components/feedback/ErrorProvider";
import NotificationProvider from "../shared/components/feedback/NotificationProvider";

interface Props {
    children: ReactNode;
}

export default function Provider({children}: Props) {
    return (
        <QueryClientProvider client={queryClient}>
            <NotificationProvider>
                <ErrorProvider>
                    <AuthProvider>
                        {children}
                    </AuthProvider>
                </ErrorProvider>
            </NotificationProvider>
        </QueryClientProvider>
    )
}