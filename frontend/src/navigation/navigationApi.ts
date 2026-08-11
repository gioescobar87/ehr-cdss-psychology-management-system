import apiClient from "../shared/api/apiClient";
import type { NavigationModule } from "./navigation.types";

export async function getNavigation(): Promise<NavigationModule[]> {

    const response = await apiClient.get<NavigationModule[]>(
        "/auth/navigation"
    );

    return response.data;

}