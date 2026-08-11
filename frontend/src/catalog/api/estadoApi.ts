import apiClient from "../../shared/api/apiClient";
import type { Response, Request } from "../types/estado.types";

const BASE_PATH = "/catalogos/estado";

export async function getAll(): Promise<Response[]> {
    const response = await apiClient.get<Response[]>(BASE_PATH);
    return response.data;
}

export async function getById(id: number): Promise<Response> {
    const response = await apiClient.get<Response>(`${BASE_PATH}/${id}`);
    return response.data;
}

export async function create(request: Request): Promise<Response> {
    const response = await apiClient.post<Response>(BASE_PATH,request);
    return response.data;
}

export async function update(id: number, request: Request): Promise<Response> {
    const response = await apiClient.put<Response>(`${BASE_PATH}/${id}`, request);
    return response.data;
}

export async function remove(id:number): Promise<void> {
    await apiClient.delete(`${BASE_PATH}/${id}`);
}