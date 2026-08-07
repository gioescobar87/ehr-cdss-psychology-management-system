import apiClient from "./apiClient";
import type { NavigationModule } from "../navigation/navigation.types";

export async function getNavigation(): Promise<NavigationModule[]> {

    const response = await apiClient.get<NavigationModule[]>(
        "/auth/navigation"
    );

    return response.data;

}