import apiClient from "../../shared/api/apiClient";
import type { PsychologicalTest } from "../types/psychologicalTest.types";

const BASE_PATH = "/prueba-psicologica";

export async function getPsychologicalTests(): Promise<PsychologicalTest[]> {
  const response = await apiClient.get<PsychologicalTest[]>(BASE_PATH);
  return response.data;
}
