import apiClient from "../../shared/api/apiClient";

import type { SessionType } from "../types/session.types";

export async function getSessionTypes(): Promise<SessionType[]> {
  const response = await apiClient.get<SessionType[]>("/catalogos/tipo-sesion");
  return response.data;
}
