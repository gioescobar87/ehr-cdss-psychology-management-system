import apiClient from "../../shared/api/apiClient";

import type {
  SeguimientoObjetivo,
  SeguimientoObjetivoRequest,
} from "../types/seguimientoObjetivo.types";

export async function createSeguimientoObjetivo(
  request: SeguimientoObjetivoRequest,
): Promise<SeguimientoObjetivo> {
  const response = await apiClient.post<SeguimientoObjetivo>(
    "/seguimiento-objetivo",
    request,
  );

  return response.data;
}