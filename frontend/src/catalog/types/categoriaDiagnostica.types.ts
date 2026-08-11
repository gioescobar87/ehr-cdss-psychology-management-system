export interface Response {
    id: number;
    nombre: string;
    descripcion?: string | null;
    estado: string;
    estadoId: number;
}

export interface Request {
    nombre: string;
    descripcion?: string | null;
    estadoId: number;
}