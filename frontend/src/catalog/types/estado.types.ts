export interface Response{
    id: number;
    nombre: string;
    descripcion?: string | null;
}

export interface Request {
    nombre: string;
    descripcion?: string | null;
}